require('dotenv').config();

const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const justification = require ('./middlewares/justification')
const authenticateToken = require ('./middlewares/isAuthentificated')
const upload = multer(); // Initialiser multer pour gérer les données de formulaire
const app = express();
app.use(upload.none()); // Utiliser multer pour gérer les données de formulaire


app.use(express.text()); // Middleware pour traiter les requêtes texte


// Endpoint pour générer un token
app.post('/api/token', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Bad Request' });
    }

    const secretKey = process.env.SECRET_KEY; 


    const token = jwt.sign({ email: email }, secretKey, { algorithm: 'HS256', expiresIn: '24h' });
// Crée un token JWT valide pendant 24 heures
    res.json({ token: token });
});



// Endpoint pour justifier le texte
app.post('/api/justify', authenticateToken, (req, res) => {
    const contentType = req.get('content-type');
    if (contentType !== 'text/plain') {
        return res.status(400).json({ error: 'Bad Request. Content-Type must be text/plain.' });
    }
    
    const text = req.body; // Récupère le texte du corps de la requête
    const justifiedText = justification.justifyText(text);
    res.send(justifiedText);
});


// Port sur lequel le serveur écoutera les requêtes
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started `);
});
