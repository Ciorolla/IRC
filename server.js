const express = require('express');
const uuid = require('uuid').v4
const session = require('express-session')
const path = require("path")
const bodyParser = require("body-parser")
// var Datastore = require('nedb')
// create the server
const app = express();
const longpoll = require("express-longpoll")(app)

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

longpoll.create("/poll")

// let collection = new Datastore({
//     filename: 'db.db',
//     autoload: true
// })
// add & configure middleware
app.use(session({
    genid: (req) => {
        //console.log('Inside the session middleware')
        //console.log(req.sessionID)
        return uuid() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

// create the homepage route at '/'
app.get('/', (req, res) => {
    // console.log('Inside the homepage callback function')
    console.log("siema " + req.sessionID)
    //console.log("ścieżka do katalogu głównego aplikacji: " + __dirname)
    res.sendFile(path.join(__dirname + "/static/chat.html"))

})

app.post('/send', (req, res) => {
    req.on('data', data => {
        let color = JSON.parse(data).color
        let sys = JSON.parse(data).system
        let txt = JSON.parse(data).text
        let nick = JSON.parse(data).nick
        let dataa = { text: txt, nick: nick, system: sys, color }
        longpoll.publish("/poll", dataa)
        res.json(JSON.stringify({ isOk: "ok" }))
    })
})

app.listen(3000, () => {
    console.log('Listening on localhost:3000')
})