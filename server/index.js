const express=require("express")
const dotenv=require("dotenv");
const connectdb = require("./dbconnect");
const app=express();

dotenv.config("./env")

app.get("/",(req,res)=>{
    res.json({"server":"started"})
})

const PORT=process.env.PORT
connectdb();
app.listen(PORT,()=>{
    console.log(`Server is listening at ${PORT}`)
})