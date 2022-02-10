const path = require('path');
const express = require('express');
const app = express();

console.log(__dirname);
console.log(__filename);

const rutaDePublic = path.join(__dirname, '../public');
console.log(rutaDePublic);

// Mandar los archivos que estan en la carpeta public
app.use(express.static(rutaDePublic));

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
})

app.get('', (req,res) => {
    res.send('Estamos en la ruta raiz')
})

app.listen(3000, ()=> {
    console.log('El server acaba de iniciar en el puerto 3000')
})