const express = require("express");
const serveur = express();
const path = require("path"); //Vient avec node.js et permet de formatter les urls sur toutes les plateformes
const db = require("./config/db");

//Variable d'environnement
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

// pour pouvoir avoir accès aux dossiers public comme assets/CSS/style.css 
const dossierPublic = path.join(__dirname, "public"); 
serveur.use(express.static(dossierPublic));

//Middleware
// function authentifier(req, res, next){
//     console.log("authentification en cours");
//     next();
// }


serveur.get("/concerts", async function (req, res){
    const docs = await db.collection("concerts").get();
    
    const concerts = [];

    docs.forEach((doc)=>{
        const concert = doc.data();
        concerts.push(concert);
    });

    return res.status(200).json(concerts);
    // res.setHeader("content-type", "text/plain");
    // res.send("Allo");
    // res.end("<h1>Contact</h1>");
});


// serveur.get("/concerts/artiste", async function (req, res){
//     const docs = await db.collection("artiste").get();
    
//     const artistes = [];

//     docs.forEach((doc)=>{
//         const artiste = doc.data();
//         concerts.push(artiste);
//     });

//     return res.status(200).json(artiste);
// });


serveur.get("/users", async function (req, res){
    const docs = await db.collection("users").get();
    
    const users = [];

    docs.forEach((doc)=>{
        const user = doc.data();
        users.push(user);
    });

    return res.status(200).json(users);
});



serveur.use(function (req, res, next){
    res.statusCode = 404;

    res.render("404", { url: req.path });
    // const message = { msg: "La ressource n'existe pas" };
    // res.statusCode = 404;
    // res.json(message);
})


serveur.listen(port, function (){
    console.log("Serveur démarré au port:", port);
});
