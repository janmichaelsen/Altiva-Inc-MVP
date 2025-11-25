const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexión a Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Middleware de Autenticación
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'Token requerido' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

// --- RUTAS DE AUTENTICACIÓN ---

// 1. REGISTRO (Encriptación con Bcrypt)
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, company_rut } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // Encriptar contraseña (Salting + Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar usuario en BD
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password_hash: hashedPassword, // Guardamos SOLO el hash
        role: 'client', 
        company_rut: company_rut || ''
      }])
      .select();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'El email ya está registrado' });
      throw error;
    }

    res.status(201).json({ message: 'Usuario creado exitosamente', user: data[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const { data: users, error } = await supabase.from('users').select('*').eq('email', email).limit(1);
  
  if (error || users.length === 0) return res.status(401).json({ error: 'Credenciales inválidas' });
  
  const user = users[0];

  // Comparar contraseña ingresada con el hash de la BD
  const validPassword = await bcrypt.compare(password, user.password_hash);
  // Backdoor para demo (si usaste el seed inicial)
  const isHackathonMock = user.password_hash === '$2a$10$abcdefghijklmnopqrstuvwx' && password === '123456';
  
  if (!validPassword && !isHackathonMock) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

// --- RUTAS DE NEGOCIO ---

app.post('/api/ai/generate', verifyToken, async (req, res) => {
  const { keyData } = req.body;
  const mockSummary = `[ANÁLISIS IA]: Basado en los datos "${keyData ? keyData.substring(0, 20) : 'proporcionados'}...", se proyecta una tendencia positiva. Altiva Inc. recomienda cautela ante la volatilidad del mercado.`;
  setTimeout(() => res.json({ summary: mockSummary }), 1500);
});

app.get('/api/reports', verifyToken, async (req, res) => {
  let query = supabase.from('reports').select('*');
  if (req.user.role !== 'admin') query = query.eq('client_id', req.user.id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/reports', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(401).json({ error: 'Solo admin' });
  const { title, client_id, ai_context, file_name } = req.body;
  
  const { data, error } = await supabase.from('reports').insert([{
    title, client_id, ai_context, 
    status: 'completed',
    file_url: `https://fake-s3.com/${file_name}`
  }]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

app.listen(port, () => console.log(`Backend corriendo en puerto ${port}`));