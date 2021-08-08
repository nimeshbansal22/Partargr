const express=require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/",function(req,res){
  res.render("index");
});

app.listen(process.env.PORT, function(req, res) {
  console.log("Server started");
})
