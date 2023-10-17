const express = require('express');
const bodyParser = require('body-parser');
const justification = require ('./middlewares/justification')

const app = express();

// Middleware pour parser les requêtes JSON
app.use(bodyParser.text({ type: 'text/plain' }));
// Endpoint pour justifier le texte
app.post('/api/justify', (req, res) => {
    const text = req.body; // Récupère le texte du corps de la requête
    const justifiedText = justification.justifyText(text);
    res.send(justifiedText);
});


// Port sur lequel le serveur écoutera les requêtes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
