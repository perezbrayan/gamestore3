const express = require('express');
const cors = require('cors');
const path = require('path');
const { databaseMiddleware } = require('./middleware/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin');
const robloxRoutes = require('./routes/roblox');
const settingsRoutes = require('./routes/settings');
const usersRoutes = require('./routes/users');

require('dotenv').config();

const app = express();

// Configuración de CORS para producción y desarrollo
app.use(cors({
  origin: [
    'https://blixgg.com',
    'http://localhost:5173',  // Vite default port
    'http://127.0.0.1:5173'   // Vite default port alternative
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(databaseMiddleware);

// Logging middleware para producción
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Headers:', req.headers);
  }
  next();
});

// Configurar middleware para servir archivos estáticos
app.use('/db/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/db/public', express.static(path.join(__dirname, 'public')));

// Rutas con el prefijo /db
app.use('/db/api/auth', authRoutes);
app.use('/db/api/admin', adminRoutes);
app.use('/db/api/roblox', robloxRoutes);
app.use('/db/api/settings', settingsRoutes);
app.use('/db/api/users', usersRoutes);

// Ruta de prueba
app.get('/db', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString()
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno',
    timestamp: new Date().toISOString()
  });
});

// Puerto para el servidor
const port = process.env.PORT || 10000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`URL base: ${process.env.NODE_ENV === 'development' ? `http://localhost:${port}/db` : 'https://blixgg.com/db'}`);
});
