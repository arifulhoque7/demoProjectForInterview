const Register = require("../models/register.model.js");

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (req.body.password != req.body.confirm_password) {
    res.status(400).send({
      message: "Password not matched!"
    });
  }

  // Create a Tutorial
  const register = new Register({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  // Save Tutorial in the database
  Register.create(register, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

exports.findOne = (req, res) => {
  Register.findByEmail(req.body.email, req.body.password, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found this user.`
        });
      }
    
      else {
        res.status(500).send({
          message: "Error retrieving user "
        });
      }
    } else res.send("Successful Login. User name: " + data.name);
  });
};