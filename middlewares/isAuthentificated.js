const jwt = require('jsonwebtoken');

let wordCounts = {}; 
function resetWordCounts() {
    wordCounts = {}; 
}

// Réinitialiser le compteur à minuit (00:00)
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        resetWordCounts();
        console.log('Word counts reset.');
    }
}, 60000); // Vérifie l'heure toutes les minutes


function authenticateToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const tokenRegex = /^Bearer (.+)$/; // Expression régulière pour extraire le token
    const match = authHeader.match(tokenRegex);

    if (!match) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = match[1]; // Récupère le token à partir du match
    jwt.verify(token, process.env.SECRET_KEY, { algorithm: 'HS256' }, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        if (!wordCounts[token]) {
            wordCounts[token] = 0;

            
        }
        const justifiedWords = req.body.split(/\s+/).filter(word => word.length > 0).length;

        if (wordCounts[token] + justifiedWords > 80000) {
            
            return res.status(402).json({ error: 'Payment Required' });
        }

        // Si l'utilisateur n'a pas dépassé la limite, augmente le compteur de mots
        wordCounts[token] += justifiedWords;
      
        req.user = user;


        
        next();
    });
}

module.exports = authenticateToken;
