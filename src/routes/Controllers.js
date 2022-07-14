const { Router} = require('express');
const axios = require("axios")
const {Dog, Temperament} = require('../db')

const api_key= process.env;

const getInfo= async() =>{
    const apiUrl = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${api_key}`);
    const apiInfo = await apiUrl.data.map(e =>{
        return{
            key: e.id,
            id: e.id,
            name: e.name,
            height: e.height.metric,
            weight: e.weight.metric,
            life_span: e.life_span,
            image: e.image.url,
            temperament: e.temperament

        };
    });
    return apiInfo
};

const getDBinfo = async () => {
    return await Dog.findAll({
        include:{
            model: Temperament,
            attributes:['name'],
            through:{
                attributes:[],
            },
        }
    })
};
 const getAllInfo = async () =>{
    const infoApi = await getInfo()
    const infoDB =await getDBinfo()
    const infoFinal = infoApi.concat(infoDB)
    return infoFinal
 }


 module.exports = {
    getAllInfo
    
}