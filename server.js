import express from 'express';
import routes from './routes/index'; // Import des routes

const app = express();
const port = process.env.PORT || 5000; // Utilisation du port de l'environnement ou 5000 par défaut

// Middleware pour JSON
app.use(express.json());

// Utilisation des routes
app.use(routes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});