var express = require('express');
var fs = require("fs")
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
var cors = require('cors')
var app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static("miapag"));// include con USE
app.listen(3000)

console.log("app in funzione");

// MAI FARE app.post("/VATTELAPPESCA", send);
// function SEND (req, res) { ... }
// PIUTTOSTO
// app.post("/send", function (req, res) {


app.get("/", express.static("miapag"));// GET per la pag principale
app.post("/all", getall);
app.post("/addUser", add);
app.post("/search", search);
app.post("/rem", rem);

var transporter;
var sender = "";
app.post("/login", (req, res) => {

    sender = req.body.add;

    transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        requireTLS: true,
        auth: {
            user: req.body.add.toString(),
            pass: req.body.pass.toString()
        }
    });
    res.sendStatus(200);
});




// app.post('/upload', function (req, res) {
//     const file = req.files.photo;
//     console.log(file);
//     console.log(req.body.nonphoto);
//     console.log(req.body.nonphoto1);

//     res.send("ok");
// });

app.get("/favicon.ico", function (req, res) {
    console.log(req);

    res.send("favicon.ico")
});


var arrSalvati;// tutti quelli salvati
arrSalvati = JSON.parse(fs.readFileSync("./dati/serializzazione.json"));

function getall(req, res) {

    res.send(JSON.stringify(arrSalvati));
}

function add(req, res) {
    arrSalvati[req.body.toAdd] = req.body.mail
    serializzaArr();
    res.send(JSON.stringify(arrSalvati));
}

function search(req, res) {
    if (arrSalvati[req.body.toFind]) {
        var tempObj = {}
        tempObj[req.body.toFind] = arrSalvati[req.body.toFind]
        res.send(JSON.stringify(tempObj))
    }
    else
        throw "404. Resource Not Found :(";
}

function rem(req, res) {
    delete arrSalvati[req.body.toKill]
    serializzaArr()
    res.send(JSON.stringify(arrSalvati));
}

function serializzaArr() {
    fs.writeFileSync("./dati/serializzazione.json", JSON.stringify(arrSalvati))
}

app.post("/send", function (req, res) {

    const file = req.files.photo;
    console.log(file);
    console.log(req.body.arrSerializzato);
    console.log(req.body.subject);

    var arrDestinatari = JSON.parse(req.body.arrSerializzato)
    for (let i = 0; i < arrDestinatari.length; i++) {

        var mailOptions = {
            from: sender,
            to: arrDestinatari[i],
            priority: "high",
            date: new Date('2018-01-01 00:00:00'),
            subject: req.body.subject,
            text: req.body.messaggio,
            attachments: [
                {   // file sent as an attachment
                    filename: file.name,
                    content: file.data
                }
            ]
        };
        transporter.sendMail(mailOptions, function (error, info) {

            if (error) {
                console.log(error);
                res.status(406).send("non sent.")
            } else {
                console.log('Email sent: ' + info.response);
                res.send("sent successfully to:<br>" + JSON.stringify(arrDestinatari));

            }
        });
    }
});


