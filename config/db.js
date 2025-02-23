//Texte copié de firestore ( et ensuite modifié )

const admin = require("firebase-admin"); //Récupérer l'admin de firebase
const { getFirestore } = require("firebase-admin/firestore"); //Récupère firestore "base de donnée cloud"

const serviceAccount = require("../db-config.json"); // fichier de config téléchargé après avoir créée la base de donnée sur firestore ( et ensuite renommé )

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = getFirestore(); //récupérer la base de donnée dans une variable

module.exports = db; //exporter la base de données qu'on vient de récupérer dans la variable

