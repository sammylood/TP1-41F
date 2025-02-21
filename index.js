const express = require("express");
const serveur = express();
const path = require("path"); //Vient avec node.js et permet de formatter les urls sur toutes les plateformes

//Variable d'environnement
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

// pour pouvoir avoir accès aux dossiers public comme assets/CSS/style.css 
const dossierPublic = path.join(__dirname, "public"); 
serveur.use(express.static(dossierPublic));

serveur.get("/", function (req, res){
    res.end("<h1>Accueil</h1>");
});

serveur.get("/contact", function (req, res){
    res.end("<h1>Contact</h1>");
});

serveur.listen(port, function (){
    console.log("Serveur démarré au port:", port);
});
