// import DB
let db = require("../models/pokemon.json");

exports.getAllPokemon = function (req, res) {
  res.json(db);
};

exports.getOnePokemon = function (req, res) {
  const { id } = req.params;
  const single = db.find((p) => Number(p.id) === Number(id));
  if (!single) {
    return res.status(404).send("Pokemon with this ID does not exist");
  }
  res.json(single);
};

exports.getOnePokemonInfo = function (req, res) {
  const { id, info } = req.params;
  const acceptableFields = new Set(["name", "base", "type"]);
  const single = db.find((p) => Number(p.id) === Number(id));
  if (!single) {
    return res.status(404).send("Pokemon with this ID does not exist");
  }
  if (!acceptableFields.has(info)) {
    return res.status(400).send("You can't request this info type");
  }

  res.json(single[info]);
};
