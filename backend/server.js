const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// IMPORTACIONES NUEVAS (IA y Auth)
const { GoogleGenAI } = require('@google/genai'); 
const { OAuth2Client } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. CONFIGURACIÓN DE CLIENTES
// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Gemini AI (Toma la key de GEMINI_API_KEY en .env)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Google Auth (Toma el Client ID de GOOGLE_CLIENT_ID en .env)
// Si no tienes la variable en .env, pega el ID directamente aquí entre comillas.
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

// 2. MIDDLEWARE DE SEGURIDAD
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// --- RUTAS DE AUTENTICACIÓN ---

// Registro Manual
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, company_rut } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: hashedPassword, role: 'client', company_rut: company_rut || '' }])
      .select();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Email ya registrado' });
      throw error;
    }
    const user = data[0];
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.status(201).json({ message: 'Creado', token, user });
  } catch (err) {
    res.status(500).json({ error: 'Error servidor' });
  }
});

// Login Manual
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data: users, error } = await supabase.from('users').select('*').eq('email', email).limit(1);
    if (error || users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    const isHackathonMock = user.password_hash === '$2a$10$abcdefghijklmnopqrstuvwx' && password === '123456';
    
    if (!validPassword && !isHackathonMock) return res.status(401).json({ error: 'Password incorrecta' });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error servidor' });
  }
});

// Login con Google (SSO) - NUEVO
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  
  try {
    // 1. Verificar token con Google
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID, // Asegúrate de que coincida con el del Frontend
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 2. Buscar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    let user;

    if (existingUser) {
      // Usuario existe -> Login
      user = existingUser;
    } else {
      // Usuario no existe -> Registro automático (SSO)
      const salt = await bcrypt.genSalt(10);
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), salt); // Contraseña aleatoria

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([{ 
          name: name, 
          email: email, 
          password_hash: dummyPassword, 
          role: 'client', 
          company_rut: 'Google Auth' 
        }])
        .select()
        .single();
      
      if (createError) throw createError;
      user = newUser;
    }

    // 3. Generar JWT
    const jwtToken = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.json({ token: jwtToken, user: { id: user.id, name: user.name, role: user.role, email: user.email } });

  } catch (error) {
    console.error("Error Google Auth:", error);
    res.status(401).json({ error: 'Fallo autenticación Google' });
  }
});

// --- RUTAS DE NEGOCIO ---

// Listar Clientes (Para Admin)
app.get('/api/users/clients', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(401).json({ error: 'No autorizado' });

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, company_rut')
    .eq('role', 'client');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Generar Análisis IA (Gemini)
app.post('/api/ai/generate', verifyToken, async (req, res) => {
  const { keyData } = req.body;
  if (!keyData) return res.status(400).json({ error: 'Faltan datos' });

  try {
    const prompt = `Actúa como un analista experto. Resume y da una recomendación estratégica breve (max 50 palabras) basada en: "${keyData}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', // O usa 'gemini-1.5-flash' si prefieres
      contents: prompt,
    });

    const summary = response.text.trim();
    res.json({ summary });
    
  } catch (error) {
    console.error('Error IA:', error);
    res.status(500).json({ summary: 'No se pudo generar el análisis.' });
  }
});

// Obtener Reportes (Con filtro de seguridad y corrección de Join)
app.get('/api/reports', verifyToken, async (req, res) => {
  // Nota: Asegúrate de tener la Foreign Key en Supabase (reports.client_id -> users.id)
  let query = supabase.from('reports').select('*, users(name)');
  
  if (req.user.role !== 'admin') {
    query = query.eq('client_id', req.user.id);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Crear Reporte (Solo Admin)
app.post('/api/reports', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(401).json({ error: 'No autorizado' });
  const { title, client_id, ai_context, file_name } = req.body;
  
  const { data, error } = await supabase.from('reports').insert([{
    title, client_id, ai_context, status: 'completed', file_url: `https://fake-s3.com/${file_name}`
  }]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.listen(port, () => console.log(`Backend corriendo en ${port}`));