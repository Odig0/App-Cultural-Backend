// Importación de Firebase Admin SDK
import admin from 'firebase-admin';

// Inicializar Firebase Admin con la configuración de tu proyecto
admin.initializeApp();

// Exportar la instancia de Firestore
const db = admin.firestore();

export { db };
