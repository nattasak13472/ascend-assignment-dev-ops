const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    return res.json({ 'title': 'HELLO THIS IS ASCEND ASSIGNMENT' });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    });
}
 
module.exports = app;
