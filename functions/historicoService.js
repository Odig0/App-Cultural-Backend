import { db } from './firebase.js';

const collectionHistorico = db.collection('historico-eventos');

export const crearHistorico = async (data) => {
  const historico = { ...data, createdAt: new Date().toISOString() };
  const docRef = await collectionHistorico.add(historico);
  return { id: docRef.id, ...historico };
};

export const obtenerHistoricoPorUsuario = async (userId) => {
  const snapshot = await collectionHistorico.where('id_usuario', '==', userId).get();
  if (snapshot.empty) {
    throw new Error('No se encontraron eventos en el histórico para este usuario');
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const obtenerTodosLosHistoricos = async () => {
  try {
    const snapshot = await db.collection('historico-eventos').get();  
    const historicos = snapshot.docs.map(doc => doc.data());
    return historicos;
  } catch (error) {
    throw new Error('Error al obtener todos los históricos: ' + error.message);
  }
};

export const preguntarEvento = async (prompt) => {
  try {
    const response = await axios.post('https://4d02-190-104-20-155.ngrok-free.app/api/llm/chat', {
      prompt: prompt
    });
    return response.data;
  } catch (error) {
    throw new Error('Error al consultar el modelo LLM: ' + error.message);
  }
};