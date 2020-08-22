var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/covid-19-tracker',{useNewUrlParser:true,useCreateIndex:true});
var conn=mongoose.connection;
const userSchema = new mongoose.Schema({
        name:{
        type: String,
        required:true,
        },
        email:{
            type:String,
            required:true,
            index:{
                unique:true,
            }},
         phone_no:{
            type:Number,
            required:true,
             },
        country_name:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        date:{
            type:Date,
            default:Date.now
        }

  });

  var userModel = mongoose.model('signup_form', userSchema);
  module.exports=userModel;
  