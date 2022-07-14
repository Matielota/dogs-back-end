const { Router} = require('express');
const axios = require("axios")
const {Dog, Temperament, Conversation, Message, Users} = require('../db')
const { getAllInfo }= require ("./Controllers.js");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const api_key= "9deae35a-f927-4889-96c6-3819b00068df"

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.get('/dog', async(req,res) =>{
  try{
    const name = req.query.name;
    const dogsTotal = await getAllInfo();
    if (name) {
      const dog = dogsTotal.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      console.log(name[0])
      dog.length
        ? res.status(200).send(dog)
        : res.status(404).send("No existe el perro!!");
    } else {
      res.status(200).send(dogsTotal);
    }}
    catch(error) {
      console.log(error)}
})

router.get("/temperament", async (req, res) => {
  try{
    const temperametsAPI = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${api_key}`);
    const temperaments2= temperametsAPI.data.map(e => e.temperament).toString().split(",")
    temperaments2.forEach((p) => {
        Temperament.findOrCreate({
          where: { name: p.trim() },
        });
      });
      
      const temperamentsDB = await Temperament.findAll();
      const tempsorder = temperamentsDB.map(e => e.name).sort()
      const tempsfilters =tempsorder.filter(Boolean)
      res.json(tempsfilters);}
      catch(error) {
        console.log(error)}  
  });
router.post("/dog", async (req, res) => {
    const {
      name,
      height,
      weight,
      life_span,
      image,
      temperament,
    } = req.body;
  
    const dogCreated = await Dog.create({
        name,
        height,
        weight,
        life_span,
        image,
    });
  
    const tempSearch = await Temperament.findAll({
      where: {
        name:temperament,
      },
    });
    dogCreated.addTemperament(tempSearch);
    res.status(200).send(dogCreated);
});

router.get("/dogs/:id" , async(req,res) =>{
    const id= req.params.id;
    try{
    const allDogs= await getAllInfo()
    if (id){
        let dogID= await allDogs.filter(e => e.id == id)
        dogID.length?
        res.status(200).json(dogID):
        res.status(404).send("El id no existe")
    }}
    catch(error) {
      console.log(error)}
})





module.exports = router;
