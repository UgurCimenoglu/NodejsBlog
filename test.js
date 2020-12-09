const mongoose = require("mongoose");

const registerSchema = require("./model/post")

mongoose.connect("mongodb://localhost/arindeneme",{useNewUrlParser:"true",useUnifiedTopology:"true"});

// registerSchema.create({
//     title: "Benim İkinci Post Başlığım",
//     content : "Benim İkinci Yazım"
// },(err,data)=>{
//     console.log(err,data)
// })

// registerSchema.find({ },(err,data)=>{
//     console.log(err,data)
// })

// registerSchema.findByIdAndUpdate("5eb70baa29e07440843e6eeb",{
//     title: "Benim İkinci Post aşlığım Update Edildi."
// },(err,data)=>{
//     console.log(err,data)
// })

// registerSchema.findByIdAndDelete("5eb70baa29e07440843e6eeb",(err,data)=>{
//     console.log(err,data)
// })