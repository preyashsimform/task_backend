const express = require('express');
const server = express();
const mysql = require('mysql2');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});

server.use(express.json());
server.use(cors());

const sslOptions = {
    key: fs.readFileSync('/home/preyash/task1/server/private.pem'),
    cert: fs.readFileSync('/home/preyash/task1/server/certificate.pem')
};

server.post("/register", (req, res) => {
    const { name } = req.body;
    const { cost } = req.body;
    const { category } = req.body;

    let sql = "INSERT INTO games (name, cost, category) VALUES (?,?,?)"
    console.log(sql)
    db.query(sql, [name, cost, category], (err,result) =>{
        if (err) {
            console.log(err);
        }else{
            console.log(result);
        }
    })
});

server.get("/games", (req, res) => {

    let sql = "SELECT * FROM games";
    db.query(sql, (err,result) =>{
        if (err) {
            console.log(err);
        }else{
            res.send(result);
        }

    })
});

server.put("/edit", (req, res) => {
    const { id } = req.body;
    const { name } = req.body;
    const { cost } = req.body;
    const { category } = req.body;
    console.log(req.body);
    let sql = "UPDATE games SET name = ?, cost = ?, category = ? WHERE idgames = ?";
    db.query(sql, [name, cost, category, id], (err,result) =>{
        if (err) {
            console.log(err);
        }else{

            res.send(result);
        }
    })
});

server.delete("/delete/:index", (req,res) =>{
    const { index } = req.params

    let sql = "DELETE FROM games WHERE idgames = ?"
    db.query(sql, [index], (err,result) =>{err ? console.log(err) : res.send(result)})
})

https.createServer(sslOptions, server).listen(443, () => {
    console.log('Running in the port 443');
});
