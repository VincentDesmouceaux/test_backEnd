// Fonction pour justifier le texte à 80 caractères par ligne
function justifyText(text) {
    const words = text.split(' '); // Divise le texte en mots
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        // Ajoute le mot à la ligne actuelle avec un espace si la longueur ne dépasse pas 80 caractères
        if ((currentLine + ' ' + word).length <= 80) {
            currentLine += ` ${word}`;
        } else {
            // Ajoute la ligne actuelle au tableau de lignes et commence une nouvelle ligne avec le mot actuel
            lines.push(currentLine);
            currentLine = word;
        }
    }

    // Ajoute la dernière ligne au tableau de lignes
    lines.push(currentLine);

    // Rejoint les lignes en un seul texte
    const justifiedText = lines.join('\n');
    return justifiedText;
}

module.exports = {
    justifyText: justifyText
};