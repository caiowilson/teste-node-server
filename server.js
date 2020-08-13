const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

//TODO refatorar para usar só o db.monelname 
//?renomear arquivos para Pascal Casing???
const User = require("./app/models/user.model");
const Category = require("./app/models/category.model");
const Medication = require("./app/models/medication.model");


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initRoles()
    initUsers()
    initCategories()
    initMedications()
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// routes @TODO: adicionar um index aqui e no controllers tbm.
require("./app/routes/auth.routes")(app);
require("./app/routes/medication.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initRoles() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
function initCategories() {
  Category.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Category({
        name: "Generic",
        description: "trolololo"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        
        console.log("added 'Generic' to categories collection");
      });
      new Category({
        name: "Similar",
        description: "trolololo"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Similar' to categories collection");
      });
    }
  });
}
function initMedications() {
  Medication.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Medication({
        name: "Ibuprofeno",
        description:"Ibuprofeno ué..",
        price: 19.99,
      })
      .save((err, med) => {
        //include normalized categories ?TODO refatorar
        User.findOne({}, (err,user)=>{
          med.createdBy = user._id
          med.updatedBy = user._id
        })
        Category.find({
            name: {
              $in: "Generic"
            }
          },
          (err, cats) => {
            med.categories = cats.map(cat => cat._id);
            med.save(err => {
              console.log("added 'Ibuprofeno' to medications collection");
            });
          }
        );
      })
     
      new Medication({
        name: "Propranolol",
        description:"remedio de coração..",
        price: 3.85,
        createdBy:User.findOne({}).exec((err,user)=>{return user._id}),
        updatedBy:User.findOne({}).exec((err,user)=>{return user._id})
      })
      .save((err,med)=>{
        User.findOne({}, (err,user)=>{
          med.createdBy = user._id
          med.updatedBy = user._id
        })
        Category.find(
          {
            name: { $in: ["Similar", "Generic"] }
          },
          (err, cats) => {
            
            med.categories = cats.map(cat => cat._id);
            med.save(err => {
                            console.log("added 'Propranolol' to medications collection");
            });
          }
        );
      })
    }
  });
}
function initUsers() {
  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new User({
        username: "user",
        password: bcrypt.hashSync("user", 8),
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' with pass 'user' to user collection");
      });
    }
  });
}