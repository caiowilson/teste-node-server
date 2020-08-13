const { authJwt } = require("../middlewares");
const MedsController = require("../controllers/medicine.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.post("/api/meds", [authJwt.verifyToken], MedsController.create);
  app.get("/api/meds", MedsController.read);
  app.get("/api/meds/:id", MedsController.readOneById);
  app.put("/api/meds/:id", [authJwt.verifyToken], MedsController.update);
  app.delete("/api/meds/:id", [authJwt.verifyToken], MedsController.delete);

  // app.get(
  //   "/api/meds/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   MedsController.adminContent
  // );
};
