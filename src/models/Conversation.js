const { DataTypes } = require('sequelize');

module.exports =(sequelize)=>{
    sequelize.define("Conversation",{
        member:{
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        }
    },
    {timestamps:true})
        
    
}

