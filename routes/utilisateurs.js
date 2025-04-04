serveur.get("/utilisateurs", async function (req, res) {});
serveur.get("/utilisateurs/:id", async function (req, res) {});
serveur.post("/utilisateurs/connexion", async function (req, res) {});
serveur.post("/utilisateurs/inscription", async function (req, res) {});
serveur.put("/utilisateurs/:id", async function (req, res) {});
serveur.delete("/utilisateurs/:id", async function (req, res) {});
