import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import express from 'express';


import eventosRoutes from './eventosRoutes.js';
import historicoRoutes from './historicoRoutes.js';


const app = express();

app.use((req, res, next) => {
  logger.info(`Request to ${req.path}`, { structuredData: true });
  next();
});


app.use(eventosRoutes);  
app.use(historicoRoutes);  


export const neurocoders = onRequest((req, res) => {
  app(req, res);
});



