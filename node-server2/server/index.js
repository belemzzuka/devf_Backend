require('dotenv').config();
console.log(process.env); //para ver las variables de entorno que hay
const path = require('path');
const express = require('express');
const app = express();
const { Client } = require('pg');

const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});

client.connect(); //conectarse a la base de datos

client.query('SELECT NOW', (err, res) => {
    console.log(err, res);
});

console.log(__dirname);
console.log(__filename);

const rutaDePublic = path.join(__dirname, '../public');
console.log(rutaDePublic);

app.set('view engine', 'hbs');

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

app.get('/about', (req, res) => {
    res.render('about', {
        nombre: 'Belem',
        apellido: 'Garrido Suarez'
    }) //renderizar el archivo que va a renderizar
})

app.get('/gastos', () => {
    // Obtener los gastos de la base de datos
    res.render('gastos', {
        gastos: []
    })
})

app.post('/gasto', (req, res) => {
    // crear gasto en base de datos
    res.send('Se creó un gasto')
})

app.listen(3000, ()=> {
    console.log('El server acaba de iniciar en el puerto 3000')
})

// Rutas para CRUD