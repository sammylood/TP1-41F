const jwt = require("jsonwebtoken")

async function auth(req, res, next){
   const jeton = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]

   if(!jeton){
    return res.status(401).json({msg:"Accès Refusé, jeton manquant"});
   }

   const decode = await jwt.decode(jeton, process.env.JWT_SECRET);

   if(!decode || decode.adminStatut > 0){
    return res.status(401).json({msg:"Accès Refusé"});
   }

   req.utilisateur = decode;

   next();
}

module.exports = auth;