import { Router } from 'express';
import AppController from '../controllers/AppController'; // Import du contrôleur

const router = Router();

// Définition des routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

export default router;
