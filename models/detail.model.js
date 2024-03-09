const mongoose=require('mongoose');

const detailSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            unique:true
        },
        age:{
            type:Number
        },
        password:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

exports.Detail=mongoose.model('Detail',detailSchema)