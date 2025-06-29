import { db } from './firebase.js';

const collection = db.collection('eventos');

export const getTodos = async () => {
  const snapshot = await collection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPorId = async (id) => {
  const doc = await collection.doc(id).get();
  if (!doc.exists) throw new Error('Evento no encontrado');
  return { id: doc.id, ...doc.data() };
};

export const getPorCampo = async (campo, valor) => {
  const snapshot = await collection.where(campo, '==', valor).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const crear = async (data) => {
  const tipo = data.categoria.replace(/\s+/g, '');
  const idEvento = `${tipo}${Math.floor(Math.random() * 1000)}`;
  const evento = { ...data, idEvento, createdAt: new Date().toISOString() };
  const docRef = await collection.add(evento);
  return { id: docRef.id, ...evento };
};

export const actualizar = async (id, data) => {
  await collection.doc(id).update(data);
  return { id, ...data };
};

export const eliminar = async (id) => {
  await collection.doc(id).delete();
};
