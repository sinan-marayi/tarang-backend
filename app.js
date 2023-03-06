const express = require("express")
const path=require('path')
const cors=require('cors')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')


const app=express()

// Database Connection
mongoose.connect('mongodb+srv://sinanmarayi:database@cluster0.cnjdoba.mongodb.net/Authentication?retryWrites=true&w=majority',{useNewUrlParser:true})
mongoose.connection.on('connected',()=>{
    console.log('connected to database');
})

// public folder
app.use(express.static(path.join(__dirname,'public')))

const users= require('./routes/users')

// MiddleWares
app.use(cors());
app.use(bodyParser.json())



// Routers
app.use('/users',users)

app.get('/',(req,res)=>{
    res.send('Invalid Endpoint')
})

const port=8080
app.listen(port,()=>{
    console.log("Server Started On Port "+ port);
})
