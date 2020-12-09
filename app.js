const express = require("express");
const app = express();
const expressHandlebars = require("express-handlebars");
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const moment = require("moment");
const generateDate = require("./helpers/generateDate").generateDate
const limit = require("./helpers/limit").limit
const truncate = require("./helpers/truncate").truncate
const paginate = require("./helpers/pagination").paginate
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const methodOverride = require("method-override");



mongoose.connect("mongodb://localhost/arinproje",{
 useCreateIndex : true,
 useNewUrlParser:"true",
 useUnifiedTopology:"true"
});

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
  secret:"testotesto",
  resave:false,
  saveUninitialized:true,
  store: new mongoStore({mongooseConnection : mongoose.connection}),
  //cookie: { secure: true }
}))



app.use((req,res,next)=>{
  res.locals.Tarih = req.session.Tarih
  delete req.session.Tarih
  next();
})


app.use(fileUpload());

app.use(express.static("public"));

app.use(methodOverride("_method"));

moment.locale("tr");

app.engine("handlebars", expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{generateDate:generateDate , limit:limit , truncate:truncate , paginate:paginate}
  }), expressHandlebars());
  app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
const {userId} = req.session
if(userId){
  res.locals={
    displayLink:true
  }
  }else{
  res.locals={
    displayLink:false
  }
}
next();
})

app.use((req,res,next)=>{
  res.locals.sessionFlash = req.session.sessionFlash
  delete req.session.sessionFlash
  next();
})

const mainRouter = require("./routers/main");
const postsRouter = require("./routers/posts");
const registerRouter = require("./routers/users")
const adminRouter = require("./routers/admin/index")

app.use("/",mainRouter)
app.use("/posts" , postsRouter)
app.use("/users",registerRouter)
app.use("/admin", adminRouter)







app.listen(8000,(req,res)=>{
    console.log("Server Yayında.")
});