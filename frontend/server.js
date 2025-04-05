const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API URL
const API_URL = 'http://localhost:8000/api';

// Credenciales de usuarios (en una aplicación real, esto estaría en una base de datos)
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123'
  },
  {
    id: 2,
    name: 'Test User',
    email: 'user@example.com',
    password: 'password456'
  }
];

// Código de acceso para entrar a la página de login
const ACCESS_CODE = 'password';

// Rutas
app.get('/', (req, res) => {
  // Página de índice principal
  res.render('index');
});

app.get('/admin-login', (req, res) => {
  // Esta es la ruta protegida que solo debería ser accesible con el código correcto
  // En un entorno real, esto debería tener validación de sesión
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // En una aplicación real, esto se haría mediante un API
    // Para simplificar, hacemos la validación directamente aquí
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.render('login', { error: 'Credenciales inválidas' });
    }
    
    // Generar un token aleatorio simple
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Guardar token en cookies
    res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
    res.cookie('user', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }), { maxAge: 3600000 });
    
    res.redirect('/dashboard');
  } catch (error) {
    let errorMessage = 'Error durante el inicio de sesión';
    res.render('login', { error: errorMessage });
  }
});

app.get('/dashboard', (req, res) => {
  const token = req.cookies.token;
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  
  if (!token || !user) {
    return res.redirect('/');
  }
  
  res.render('dashboard', { user });
});

// Nueva ruta para herramientas de crédito
app.get('/herramientas', (req, res) => {
  const token = req.cookies.token;
  const user = req.cookies.user ? JSON.parse(req.cookies.user) : null;
  
  if (!token || !user) {
    return res.redirect('/');
  }
  
  res.render('herramientas', { user });
});

app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('user');
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Frontend server running on http://localhost:${PORT}`);
});
