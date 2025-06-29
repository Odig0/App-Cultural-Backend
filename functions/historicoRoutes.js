import express from 'express';
import { db } from './firebase.js'; // Importar la configuración de Firebase
import { crearHistorico, obtenerHistoricoPorUsuario, obtenerTodosLosHistoricos } from './historicoService.js'; // Importar las funciones del servicio
import axios from 'axios';
const router = express.Router();

// Colección de eventos y histórico
const collectionEventos = db.collection('eventos');
const collectionHistorico = db.collection('historico-eventos');

// Endpoint para llenar la colección 'historico-eventos' con eventos de la colección 'eventos'
router.post('/historico-eventos/llenar-historico', async (req, res) => {
  const { id_usuario } = req.body;

  // Verificar que el id_usuario esté presente
  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta el id_usuario.' });
  }

  try {
    // Obtener todos los eventos de la colección 'eventos'
    const eventosSnapshot = await collectionEventos.get();

    if (eventosSnapshot.empty) {
      return res.status(404).json({ error: 'No se encontraron eventos en la colección.' });
    }

    // Crear el histórico de eventos por usuario
    const historicoPromises = eventosSnapshot.docs.map(async (doc) => {
      const evento = doc.data();
      const historico = {
        id_usuario, // Asociar al usuario
        nombre_evento: evento.nombre,
        foto_evento: evento.imagen, // La URL de la imagen en el bucket de Google Cloud Storage
        fecha_evento: evento.fecha, // Fecha del evento
      };
      
      // Guardar el histórico en la colección 'historico-eventos'
      await crearHistorico(historico);
    });

    // Esperar que todos los historiales se guarden
    await Promise.all(historicoPromises);

    res.status(201).json({ message: 'Eventos históricos guardados correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el histórico', details: error.message });
  }
});

// Endpoint para crear el histórico de eventos manualmente
router.post('/historico-eventos/create-historico', async (req, res) => {
  const { id_usuario, nombre_evento, foto_evento, fecha_evento } = req.body;

  if (!id_usuario || !nombre_evento || !fecha_evento) {
    return res.status(400).json({ error: 'Faltan datos esenciales.' });
  }

  const historico = { id_usuario, nombre_evento, foto_evento, fecha_evento };

  try {
    const historicoGuardado = await crearHistorico(historico);
    res.status(201).json(historicoGuardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el histórico', details: error.message });
  }
});

// Endpoint para obtener el histórico de eventos por id_usuario
router.get('/historico-eventos/id/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const historico = await obtenerHistoricoPorUsuario(userId);
    res.status(200).json(historico);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el histórico', details: error.message });
  }
});

router.get('/historico-eventos', async (req, res) => {
  try {
    const historicos = await obtenerTodosLosHistoricos(); // Función que obtendrá todos los históricos
    res.status(200).json(historicos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener todos los históricos', details: error.message });
  }
});





export default router;
