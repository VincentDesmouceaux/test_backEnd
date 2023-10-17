const jwt = require('jsonwebtoken');

const wordCounts = {};

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
        if (wordCounts[token] >= 80000) {
            // Le token a dépassé la limite de mots autorisée (80,000 mots)
            console.log(`User with token ${token} exceeded word limit.`);
            return res.status(402).json({ error: 'Payment Required' });
        }
    
        // Si le token n'a pas dépassé la limite, augmentez le compteur de mots
        wordCounts[token]++;
        console.log(`User with token ${token} justified ${wordCounts[token]} words today.`);
        req.user = user;


        
        next();
    });
}

module.exports = authenticateToken;
