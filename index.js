// dotenv function
require("dotenv").config();
const port= process.env.port
const keys= process.env.key
const imageKey= process.env.imagekey
console.log(port)
//dotenv function

const express = require("express");
const app= express();
const https =require("https");
const ejs =require('ejs')
const{send}=require("process")
const {dirname}= require('path')
const bodyParser = require('body-parser');
const { on } = require("events");
const { error } = require("console");
app.use('/design.css',express.static('design.css')) 
app.use('/design2backend.css',express.static('design2backend.css'))




app.use(bodyParser.urlencoded({extended:true}))



app.set('view engine','ejs');





app.get("/",(req,res)=>{
     res.sendFile(__dirname +"/interface.html");
   
})
app.post('/', (req,res)=>{
    
     let CITYNAME = req.body.searchBar;
     //Database={tempp:"Temperature", humidity:"hu"};
     const key=`${keys}`
     const weatherurl=" https://api.openweathermap.org/data/2.5/weather?q="+CITYNAME+"&appid="+key+"&units=metric";
    let Database={
     tempp:"",
     humidity:" ",
     Maxtemp:"",
     Mintemp:"",
     windspeed:" ",
     pressure:" ",
     weather:" ",
     icon:" ",
     CITYNAME:" ",
     BgImage:" ",
    }
     console.log("server is started")
     https.get(weatherurl,(request,response)=>{
          
          if(!(request.statusCode>=200 && request.statusCode<=299)){
               res.sendFile(__dirname +"/error.html");
               
          }else{
               
        request.on('data',(data)=>{
          const weatherdata = JSON.parse(data);
         // console.log(weatherdata);
          const Icon= weatherdata.weather[0].icon;  
          console.log( weatherdata.main.temp)
          //const Database={}
          Database.tempp= weatherdata.main.temp;
          Database.humidity=weatherdata.main.humidity;
          Database.Maxtemp=weatherdata.main.temp_max;
          Database.Mintemp=weatherdata.main.temp_min;
          Database.windspeed=weatherdata.wind.speed;
          Database.pressure=weatherdata.main.pressure;
          Database.weather=weatherdata.weather[0].description;
          Database.icon=Icon;
          Database.CITYNAME=CITYNAME;
          
          
          
         // const IconUrl='https://openweathermap.org/img/w/'+Icon+'.png';
          //res.send("temperature is"+ temp)
        
           
      })
        request.on('end',()=>{
             const imagekey=`${imageKey}`
             const imageurl="https://api.unsplash.com/search/photos?page=1&query="+CITYNAME+"&client_id="+imagekey;

             https.get(imageurl,(response2)=>{

                  let chunks=[];

             
                  response2.on('data',function(data){
                       chunks.push(data);
                       

                  }).on('close',function() {
                        const data=Buffer.concat(chunks);
                        const imageData = JSON.parse(data);
                       // console.log(imageData)
                        let BgImage=imageData.results[0].urls.raw;
                        //console.log(BgImage)
                        Database.BgImage=BgImage;
                  res.render("bg",{Database:Database});
                     

                  })
                   
             })  
             
        })

        

      
          }
     })
})
app.listen(`${port}`|| process.env.PORT,()=>{
    console.log('server started')
})

 



