const db = require("../models");
const Medication = db.medication
const Category = db.category


//TODO responder os erros com json e message



exports.create = (req, res) => {
  Medication.findOne({name:req.body.name}, (err, medication)=>{
    if (medication) {
      res.status(409).send("An error ocurred when saving the request data, medication already exists")
    } else {
      new Medication({
        name: req.body.name,
        description:req.body.description,
        price: req.body.price,
        createdBy:req.userId,
        updatedBy:req.userId
      })
      .save((err, med) => {
        if (err) res.status(400).send("An error ocurred when saving the request data, double check your data")
        Category.find({
          name: {$in: req.body.categories}
        }, (err, categories)=>{
          med.categories = categories.map(category => category._id)
          med.save((err, med)=>{
            if (err) res.status(400).send("An error ocurred when saving the request data, double check your data")
            res.status(200).send(med)
          })
        })
      })
    }    
  })
}
exports.read = (req, res) => {
  Medication.find((err,doc)=>{
    if (err) res.status(500).send("Internal error fetching medications")
    else res.status(200).send(doc)
  })
};
exports.readOneById = (req, res) => {
  Medication.findById({_id: req.params.id}, (err,medication)=>{
    if (err || !medication) res.status(404).send("Medication not found")
    else res.status(200).send(medication)
  })
}
exports.update = (req, res) => {
  Medication.findByIdAndUpdate(
    {_id: req.params.id},
    {
      name:req.body.name,
      description:req.body.description,
      price:req.body.price,
      // categories:undefined, //@TODO implementar adição/remoção de cats
      updatedBy:req.userId
    },
    {
      new:true,
      omitUndefined:true
    },
    (err, med) => {
       if (err) return res.status(404).send("Medication not found")
      Category.find({
        name: {
          $in: req.body.categories
        }
      }, (err, categories) => {
        if (categories.length>0) {
          med.categories = categories.map(category => category._id)
          med.save((err, med) => {
            if (err) res.status(400).send("An error ocurred when saving the request data, double check your data")
            res.status(200).send(med)
          })
        }else{
          res.status(200).send(med)
        }
      })

    })
}
exports.delete = (req, res) => {
  Medication.findByIdAndDelete({_id: req.params.id}, (err,medication)=>{
    if (err) res.status(404).send("Medication not found")
    res.status(200).send(medication)
  })
}

exports.userContent = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminContent = (req, res) => {
  res.status(200).send("Admin Content.");
};
