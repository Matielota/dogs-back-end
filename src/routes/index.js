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

router.post("/conversation", async(req,res)=>{
  const {senderId, receiverId} = req.body;
  try{
    const busqueda = await Conversation.findOne({
      where:{
        member:[senderId,receiverId] ,
      }
    })
    if(busqueda){
      await busqueda.update({
      member:[senderId,receiverId]})
      res.send("se updateo") 
    }else{
    await Conversation.create({
      member:[senderId,receiverId]} 
    );
    res.send("se creo")}
  
  }
  catch(err){
    res.status(500).send(err)
  }
})

router.get("/conversation/:userId", async(req,res)=>{
  const {userId} = req.params;
  
  console.log(typeof userId === "number")
  try{
    console.log(userId)
    const conversation = await Conversation.findAll({ 
      member: [userId]
    })
    let mapConversations = conversation.map(e => e.dataValues)
    let onlyUser = mapConversations.filter(e => e.member.includes(Number(userId)))
    console.log(conversation)
    res.status(200).json(onlyUser)
  }
  catch(err){
    res.status(500).send(err)
  }
})

router.post("/message", async (req,res)=>{
  const {text , conversationId, sender} = req.body;
  try{
   const mensaje = await Message.create({
      text: text,
      conversationId: conversationId,
      sender:sender
    })
    res.status(200).json(mensaje)
  }
  catch(err){
    res.status(500).send(err)
  }
})
router.get("/allmessage/:conversationId", async (req,res) =>{
  const {conversationId} = req.params;
  try{
  const allmessage = await Message.findAll({
    where:{
      conversationId: conversationId
    }
  })
  res.status(200).json(allmessage)
} catch(err){
  res.send (error)
} 
})
router.post("/userregister",async (req, res) => {
      const {
        email,
        password,
        name,
        surname,
        phone,
        
        age,
        document,
        phone2,
        
      } = req.body;

      const created = await Users.create({
          email: email,
          password: password,
          name: name,
          surname: surname,
          phone: phone,
          
          age: age,
          document: document,
          phone2: phone2,
          
        },
      );
      
        console.log("llego aca")
        res.status(200).send(created);
   
  });

  router.get("/users", async (req, res) => {
    
      const users = await Users.findAll({
      });
    res.json(users)
    })

module.exports = router;
