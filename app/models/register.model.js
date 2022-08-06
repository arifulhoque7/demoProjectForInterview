const sql = require("./db.js");

const Register = function (register) {
  this.name = register.name;
  this.email = register.email;
  this.password = register.password;
};

Register.create = (newRegister, result) => {
  sql.query("INSERT INTO register SET ?", newRegister, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newRegister });
    result(null, { id: res.insertId, ...newRegister });
  });
};

Register.findByEmail = (email, password, result) => {

  sql.query(`SELECT * FROM register WHERE email = ${sql.escape(email)} AND password = ${password}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

module.exports = Register;

