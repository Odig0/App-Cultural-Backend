import express from 'express';
import { getTodos, getPorId, getPorCampo, crear, actualizar, eliminar } from './eventosService.js'; 
const router = express.Router();

router.get('/eventos', async (req, res) => {
  try {
    const eventos = await getTodos();
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/eventos/id/:id', async (req, res) => {
  try {
    const evento = await getPorId(req.params.id);
    res.json(evento);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});


router.post('/eventos/crearEvento', async (req, res) => {
  try {
    const nuevoEvento = await crear(req.body);
    res.status(201).json(nuevoEvento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;
