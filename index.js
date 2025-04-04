const express = require("express");
const serveur = express();
const path = require("path"); //Vient avec node.js et permet de formatter les urls sur toutes les plateformes
const db = require("./config/db");
const cors = require("cors");

//Variable d'environnement
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

serveur.use(cors());
serveur.use(express.json()); //Permet de passer la donnée json dans le body
serveur.use(express.urlencoded({extended:true})); //Permet de passer la donnee de formulaire


// pour pouvoir avoir accès aux dossiers public comme assets/CSS/style.css 
const dossierPublic = path.join(__dirname, "public"); 
serveur.use(express.static(dossierPublic));

//Middleware
function authentifier(req, res, next){
    console.log("authentification en cours");
    next();
}



serveur.get("/concerts/:id", async (req, res) => {
    //Destructuration
    const { id } = req.params;

    const docRef = await db.collection("concerts").doc(id).get();
    const concert = { id: docRef.id, ...docRef.data() };

    return res.json(concert);
});


serveur.get("/concerts/:date", async function (req, res){

       const {date} = req.params;

       const objDb = await db.collection("concerts").doc(date).get();

       const concert =  { date: objDb.date, ...objDb.data() };
    
        return res.status(200).json(concert);

});

serveur.get("/liste-concerts", async function (req, res){
    
    try {
    const docs = await db.collection("concerts").get(); // la variable doc contient le contenu de la collection recherchée ( dans ce cas-ci collection concerts )
    
     const { ordre = "date", direction = "asc" } = req.query;


        //dans le cas ou on cherche dans une collection qui n'a pas de films
        if(docs.size == 0){
            const reponse = {
                msg: "Aucun concert trouvé",
            };
            return res.status(400).json(reponse);
        }

    const concerts = [];
    docs.forEach((doc) => {
        const key = {id: doc.id}; // Va chercher le id du "document" dans la base de données Firebase
        const concert = doc.data();
        
        console.log(key);
        // concert.id = docRef.id;
        concerts.push({...key, ...concert});
    });

    return res.status(200).json(concerts);
    // res.setHeader("content-type", "text/plain");
    // res.send("Allo");
    // res.end("<h1>Contact</h1>");

    } catch (erreur) {
        const reponse = {
            msg : erreur,
        };
        return res.status(400).json(reponse);
    }
        
});



serveur.post("/concerts/initialiser", async (req, res)=>{
    
    const concertDepart = require("./data/dataTest");

    concertDepart.forEach(async (concert) => {
        const refs = await db.collection("concerts").where("titre", "==", concert.titre).get();

        if(refs.size == 0) {
            await db.collection("concerts").add(concert);
            console.log("ajouté");
        } else {
            console.log("déjà présent");
        }
        
    });

    const reponse = {
        msg: "La base de donnée est initialisée",
    };
    return res.status(200).json(reponse);
});



serveur.post("/concerts", async function (req, res){
    
    const  body  = req.body;

    console.log(body);

    // const dateModif = dayjs().utc().toIsoString();
    // console.log(dateModif);
    // body.dateModif=dateModif;

    await db.collection("concerts").add(body);

    return res.status(201).json({ msg: "Le film a été ajouté" });
});

serveur.post("/concerts/image", (req, res) => { })



// serveur.get("/concerts/artiste", async function (req, res){
//     const docs = await db.collection("artiste").get();
    
//     const artistes = [];

//     docs.forEach((doc)=>{
//         const artiste = doc.data();
//         concerts.push(artiste);
//     });

//     return res.status(200).json(artiste);
// });



// serveur.post("users/inscription", 
//     [
//     check("courriel").escape().trim().notEmpty.isEmail().normalizeEmail(),
//     check("mdp").escape().trim().notEmpty.isStrongPassword({ minLength: 8, minNumber:1, minLowercase: 1, minUppercase: 1, minSymbols: 1 }),
//     ],
//      async (req,res) => {
//     // valider les infos (express validator)
//     // récuperer les infos du body avec identifiant unique, mot de passe /on l'envoie dans le body
//     // vérifier si user existe
//     // Encrypter le mot de passe
//     // Ajouter l'user à la db


//     // valider les infos ( est-ce que courriel et mdp existe )
//      // À faire
//     const erreursValidation = validationResult(req);

//     if(!erreursValidation.isEmpty()){
//         return res.status(400).json({msg: "Données invalides"});
//     }
       

//     // récuperer les infos du body avec identifiant unique, mot de passe
//     const { courriel, mdp, tel }  = req.body;

//     // vérifier si user existe
//     const userRefs = await db.collection("users").where("courriel", "==", courriel).get();
//         //.docs est un tableau avec toutes les infos
//     if(userRefs.docs.length>0){
//         return res.status(400).json({msg: "user existant"});
//     }    
//     // Encrypter le mot de passe
//     const hash = await bcrypt.hash(mdp, 10); //Le nombre de tours qu'on fait pour encrypter
//     const user = {...req.body, 
//         "courriel":courriel, //si ma clé est le même nom que le nom de la variable on n' pas besoin de l'ajouter
//         mdp: hash, 
//         tel,
//     }

//     // Ajouter l'user à la db
//     // await db.collection("users").add(req.body);
//     await db.collection("users").add(user);

//     return res.status(201).json({msg: "L'user a été créé"});
// });



// serveur.post("/users/connexion", async () => {});
//     //Valider les donneés

//     //Récupérer les infos du body avec identifiant unique 
//     const { courriel, mdp, tel }  = req.body;

//     // récuperer les infos du body avec identifiant unique, mot de passe /on l'envoie dans le body
//     // vérifier si user existe
//     const userRefs = await db.collection("users").where("courriel", "==", courriel).get();
//     if(userRefs.docs.length>0){
//         return res.status(400).json({msg: "user existant"});
//     }    
    
//     // Vérifie le mot de passe
//     const utilistateur = userRefs.docs[0].data();

//     const motsPassesPareils = await bcrypt.compare(mdp, user.mdp);

//     if(motsPassesPareils){
//         //On retourne une authentification
//         delete utilistateur.mdp;
//         const option = {
//             "expiresIn":"1d", //pour desjardins par exemple on mettrait 15m
//         };
//         const jeton = jwt.sign(user, process.env.JWT_SECRET, options);

//         return res.status(200).json({msg: "user connecté", user});
//     }else{
//         return res.status(400).json({msg: "Mot de passe invalide"});
//     }
//     // On retourne une authentification





serveur.use(function (req, res, next){
    res.statusCode = 404;

    res.json({ url: req.path });
    // const message = { msg: "La ressource n'existe pas" };
    // res.statusCode = 404;
    // res.json(message);
})


serveur.listen(port, function (){
    console.log("Serveur démarré au port:", port);
});
