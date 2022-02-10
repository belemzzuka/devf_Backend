// PARA CONECTAR EN TERMINAL: psql --host=localhost --port=5432 --username=postgres --dbname=postgres
require('dotenv').config(); //cargar las variables de entorno de .env
console.log(process.env); //Imprimir todo lo que tiene .env

// Separar librerías de ejecuciones y puertos
const express = require('express'); //cargar el contenido de la librería express
const { Pool, Client } = require('pg'); //cargar el contenido de pg con las clases pool y client
const moment = require('moment');
moment.locale('es-mx');
const formatNumber = require('format-number');
//const sql = require('sql'); //cargar el contenido de la librería sql

//console.log('VARIABLES DE ENTORNO');

const app = express(); //ejecutar express
//sql.setDialect('postgres'); //settear el lenguaje de sql que vamos a usar

// Borramos en package.json: //"start": "PGUSER=postgres PGHOST=localhost PGPASSWORD=renato PGDATABASE=postgres PGPORT=5432 node ./server"
const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
})

client.connect();

client.query('SELECT NOW()', (err, res) => {
    console.log(err, res); //si no hay nada en el error, viene NULL
})

//HACER LA CONEXION A LA DB CON POOL
// pools will use environment variables
// for connection information
//const pool = new Pool(); //inicializar pool

//hace el query con un string de sql dentro de js
/*
pool.query('SELECT * from gastos', (err, res) => {
    console.log(err, res)
    pool.end()
  })
*/

const port = 3000; //el puerto en el que va a correr el server

//definir las tablas que existen en la DB
//const gastos = sql.define({
//    name: 'gastos',
//    columns: ['id','created_at','amount']
//});

//hacer queries sobre la DB

// respond with "hello world" when a GET request is made to the homepage
//funcion app.get que recibe 2 parametros (request y response)
app.get('/saludo', function (req, res) { 
    res.send('Hello World!! 🐥')
  });

//app.post()
//app.push()
//app.delete()

//traemos el dato de valor con :atributo
app.get('/registra-gasto/:amount', (req, res) => { 
    const params = req.params;
    const amount = params.amount;
    
    //guardar el dato que mandamos en la DB
    const query = {
        text: 'INSERT INTO gastos(amount) VALUES($1)',
        values: [amount]
    }
    //client.connect();
    client.query(query, (err, respuesta) => {
        if (err) {
          //console.log(err.stack) //como fue el stack de archivos
          res.send('Hubo un error');
        } else {
          //console.log(respuesta.rows[0])
          return res.send('Acabo de registrar tu gasto por ' + formatNumber({prefix: '$$'})(params.amount) + '!! 💰')
        }
        client.end(); //cerrar la conexión con la db
      })
  });

app.get('/lista', (req, res) => {
    // 1. consultar la DB y obtener los gastos
    client.query('SELECT * FROM "gastos";', (err, postgresRes) => {
        if (err) {
            // contestar que hubo error
            console.log(err);
        } else {
            // 2. darle formato a cada uno de los gastos. Formato en un sólo string
            const gastos = postgresRes.rows;
            const formattedArray = gastos.map(gasto => { // abrimos llave para meter ahi el parsedDate porque afuera no conoce 'gasto'
                const parsedDate = moment(gasto.created_at).format('LLL') //formateamos con la libreria moment
                return `<p id="${gasto.id}"> ${parsedDate} : $$${gasto.amount} </p>` 
            })
            const formattedString = formattedArray.join('');
            
            // 3. mandar la lista de gastos
            return res.status(200).send(formattedString);

        }
        res.status(404).send('Estamos trabajando para resolver esto :('); // temporal
    })
});

// borrar un valor de la DB
app.get('/borrar-gasto/:id', (req, res) => {
    const params = req.params;
    const id = params.id;

    const query = {
        text: 'DELETE FROM gastos WHERE gastos.id=$1;',
        values: [id]
    }

    client.query(query, (error, respuesta) => {
        if(error){
            console.log(error.stack); // stack es para saber especificamente el error
            return res.send('Hubo un error');
        } else {
            if (respuesta.rowCount === 0){
                return res.send('No encontré ningún gasto con el ID que me estás pasando 😞')
            }
            return res.send('Acabo de borrar tu gasto con ID ' + id)
        }
    })
})


//Actualizar un valor en la db
app.get('/modificar/:id/:amount', (req,res) => {
    const params = req.params;
    const id = params.id;
    const amount = params.amount;

    const query = {
        text: 'UPDATE gastos SET amount = $2 WHERE id = $1;',
        values: [id, amount]
    }

    client.query(query, (err,respuesta) => {
        if(err){
            console.log(err.stack);
            return res.send('Hubo un error');
        } else {
            return res.send('Acabo de actualizar tu gasto con ID ' + id)
        }
    })
})


//esto es para abrir el servidor
  app.listen(port, ()=> {
      console.log("Este servidor está vivito y coleando!! 🚀");
  });

// CRUD - Create ✅, Read ✅, Update, Delete ✅