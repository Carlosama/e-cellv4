import Serialport from 'serialport'
import path from 'path'
import {fileURLToPath} from 'url'
import * as io from "socket.io"
import http from 'http'
import { createServer } from 'http'
import express from 'express'
import dotenv from 'dotenv'

/*inicializar .env*/
dotenv.config()

/*conexión a función express*/
const app = express()

/* start server*/
app.listen(3000, () => {
    console.log('server listening on port', 3000)
})
// var => let
/*para utilizar la conexión */
const Readline = Serialport.parsers.Readline

const port = new Serialport(process.env.PUERTO_COM, {
    baudRate: parseInt(process.env.BAUDIOS)
})

const parser = port.pipe(new Readline({delimiter: '\r\n'}))

/*en apertura o llegada de línea por primera vez*/
parser.on('open', () => {
    console.log('connection is opened')
})

/*en captura por cada línea recibida*/
parser.on('data', (data) => {
    procesarLineaRecibida(data)
})

const procesarLineaRecibida = (data) => {
    console.log(data.toString());
    socketIo.sockets.emit('connection:data', {
        value: data.toString()
    });
}

parser.on('error', (error) => {
    console.log('ERROR', error)
})

const server = createServer(app);

const socketIo = new io.Server(server);
/*const socketIo = socket(server);*/


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.get('/', function (req, res){
    res.sendFile(__dirname + '/server/index.html');
})

/*

const express = import("express.*");
const socketIo = import('socket.io.*');
const http = require('http');

const app = express;
const  server = http.createServer(app);

/!*problemas con listen 'TypeError: socketIo.listen is not a function'*!/
const io = socketIo.listen(server);

/!*para utilizar la conexión *!/
const  parser = new Readline();

/!*realizar la conexión al puerto*!/
 const mySerial = new SerialPort('COM8',{
    baudRate: 9600
});

 mySerial.on('open',function (){
     console.log('Opened Serial Port')
 });

 mySerial.on('data',function (data){
    console.log(data.toString());
    io.emit('connection:data',{
        value:data.toString()
    });
 });

 mySerial.on('err',function (err){
     console.log(err.message);
 })

server.listen(3000,() => {
    console.log('server on port',3000);
});
 /!*ruta para transmitir a web*!/*/
/*conexión a puerto serial llamado*/
/*const SerialPort = import('serialport.*');
/!*lee lineas del puerto serial*!/
const Readline = SerialPort.Readline;*/
