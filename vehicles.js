const express = require('express');
const jwt = require('jsonwebtoken');
const Vehicle = require('../models/Vehicle');
const router = express.Router();

const SECRET = process.env.JWT_SECRET;

// Middleware de autenticación
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(403).json({ error: 'Token faltante' });
  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Guardar vehículo
router.post('/add', verifyToken, async (req, res) => {
  const { plate, brand, model } = req.body;
  const newVehicle = new Vehicle({ userId: req.userId, plate, brand, model });
  await newVehicle.save();
  res.json({ message: 'Vehículo guardado' });
});

// Listar vehículos
router.get('/', verifyToken, async (req, res) => {
  const vehicles = await Vehicle.find({ userId: req.userId });
  res.json(vehicles);
});

module.exports = router;
