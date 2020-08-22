var express = require('express');
var router = express.Router();
var bcrypt=require('bcrypt');
var userModel=require('../modules/signup');
const fetch = require('node-fetch');
let settings = { method: "Get" };
let url = "https://coronavirus-19-api.herokuapp.com/countries";
function checkEmail(req, res, next){
  var email = req.body.email;
  var checkexistemail=userModel.findOne({ email:email });
  checkexistemail.exec(function (err,data){
    if (err) throw err;
    if (data)
    {
      return res.render('/');
    }
    next();
  }); 
}
function checklogin(req,res,next)
{
  if(!req.session.email)
  {
    return res.render('index',{title:'COVID-19  Tracker',error:'login  is required to access this page'});
  }
    next();
}
/* GET home page. */
router.get('/',function(req, res, next) 
{
  fetch(url,settings).then(res => res.json()).then((data) => {
  res.render('index', { title: 'world record for COVID-19',record:data,email:req.session.email,country_name:req.session.country,country_name:req.session.country});

});
});
router.get('/country_wise', function(req, res, next) {
  
    fetch(url,settings).then(res => res.json()).then((data) => {
    res.render('countrywise', { title: 'world record for COVID-19',record:data,email:req.session.email ,country_name:req.session.country});

    });   
});
router.get('/about', function(req, res, next) {
  
  res.render('about', { title: 'world record for COVID-19',email:req.session.email,country_name:req.session.country });   
});
router.get('/india_data',function(req, res, next) {
  let india_url="https://coronavirus-19-api.herokuapp.com/countries/india";
  fetch(india_url,settings).then(res => res.json()).then((data) => {
  res.render('allindia_data', { title: 'India record for COVID-19',india_record:data,email:req.session.email,country_name:req.session.country });

  });
  
});
router.get('/state_wise',function(req, res, next) {
  let state_url="https://api.covidindiatracker.com/state_data.json/";
  fetch(state_url,settings).then(res => res.json()).then((data) => {
  res.render('india_state_wise', { title: 'State wise record',india_state:data,email:req.session.email,country_name:req.session.country });

  });
  
});
router.get('/state_district/:id', checklogin,function(req, res, next) {
  let state_url="https://api.covidindiatracker.com/state_data.json/";
  var id=req.params.id;
  fetch(state_url,settings).then(res => res.json()).then((data) => 
  {
     res.render('india_district_wise', {title:'District record',state_district:data,email:req.session.email,id:id,country_name:req.session.country});
  });
});
router.get('/country/:country', function(req, res, next) {
  var country=req.params.country;
  let countrytotal="https://coronavirus-19-api.herokuapp.com/countries/"+country;
  if(country=="USA")
  {
    country="US";
  }
  fetch(countrytotal, settings).then(res => res.json()).then((totaldata) => {
    res.render('country', { title:'COVID-19 tracker',countrytotal:totaldata,country:country,email:req.session.email});
  });
});
router.post('/signup',checkEmail,function(req, res, next) {
  var name=req.body.name;
  var email=req.body.email;
  var phone_no=req.body.phone;
  var country_name=req.body.country;
  var password = req.body.password;
  var cpassword=req.body.cpassword;
  if(password!=cpassword)
  {

    fetch(url,settings).then(res => res.json()).then((data) => {
    res.render('index', { title: 'world record for COVID-19',record:data,email:req.session.email,country_name:req.session.country,error:"confirm password is not match"});

});

  }
  else 
  {
    password=bcrypt.hashSync(password,10);
    var signupdetails=new userModel({
     name:name,
      email:email,
      phone_no:phone_no,
      country_name: country_name,
      password: password,
    });
    signupdetails.save(function (err,data){
         if (err) throw err;
         fetch(url,settings).then(res => res.json()).then((data) => {
        res.render('index', {title: 'Covid-19-tracker' , success: 'you are registered successfully',record:data,email:req.session.email,country_name:req.session.country});
      });
    });
  }
});
router.post('/login', function(req, res, next) {
   var email=req.body.email;
   var password=req.body.password;
    var checkuser=userModel.findOne({email:email});
    checkuser.exec(function(err,data){
     if(err) throw err;
     var getpassword=data.password;
    if(bcrypt.compareSync(password,getpassword))
    {
      req.session.email=data.email;
      req.session.country=data.country_name;
      fetch(url,settings).then(res => res.json()).then((data) => {
      res.render('index', { title: 'world record for COVID-19',success:'login sucessfully!',record:data,email:req.session.email,country_name:req.session.country,country_name:req.session.country}); 
    });
  }
   else
    {
      res.render('index', { title: 'Covid-19-tracker' ,error:'username and password does not match',email:req.session.email,country_name:req.session.country});
    }
     
    });
});
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    if (err)
    {
      res.redirect('/');
    }
  });
      res.redirect('/');
});
module.exports = router;
