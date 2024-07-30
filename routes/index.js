import { Router } from 'express';
import AppController from '../controllers/AppController'; // Import du contrôleur
import UsersController from '../controllers/UsersController';

const router = Router();

// Définition des routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

export default router;
