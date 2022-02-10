const path = require('path');
const express = require('express');
const res = require('express/lib/response');
const app = express();

console.log(__dirname);
console.log(__filename);

// Middleware es un código que se va a ejecutar antes de que llegue a una ruta. app.use
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); //para que sepa que se tiene que pasar a la siguiente función
})

app.use(express.static(path.join(__dirname, '../public'))) //path.join concatena los valores en un solo path

/*
app.get('/', (req, res) => {
    res.send('Esás en / 😁')
})*/

app.get('/ayuda', (req, res) => {
    res.send(`<p> Este sitio web es personal con fines educativos.</p>
                <p> Derechos Reservados: @belemzzuka </p>
                <p> Versión: 1.0 </p>
                <p> Año: 2022 </p>`);
})

app.get('/about', (req, res) => {
    res.send([
        {
            name: 'Belem',
            age: 36,
            nationality: 'Mexicana'
        },
        {
            name: 'Sofia',
            age: 31,
            nationality: 'Mexicana'
        }
    ])
})

app.get('/yo', (req, res) => {
    res.set('title', 'Sitio de Belem');
    res.send('Me llamo Belem');
    
})

app.listen(3000, () => {
    console.log('El servidor está prendido en el puerto 3000');
})

// localhost:3000

// mipagina.com/ayuda
// mipagina.com/sobremi
// mipagina.com/yo/proyectos

// HTTP y HTTPS (Protocolos)
// Utilizar una ruta siempre con el método GET

// API (Application Programming Interface)
// RESTful API 
// REST

// CRUD
// Create -         POST -              mipagina.com/gasto
// Read -           GET -               mipagina.com/gasto/:id
//                                      mipagina.com/gastos
// Update -         PUT/POST -          mipagina.com/gasto/:id
// Delete -         DELETE/POST -       mipagina.com/gasto/:id