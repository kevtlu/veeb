const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasõnad.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:false}));
 
app.get("/", (req, res)=>{
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	res.render("timenow", {wd: dateEt.weekDay(), date: dateEt.longDate()});
});

app.get("/vanasonad", (req, res)=>{
	fs.readFile(textRef, "utf8", (err, data)=>{
		if (err){
			res.render("genericlist", {heading: "Vanasõnad", listData: ["Vabandame, ühtki vanasõna ei leitud!"]});
		}
		else {
		res.render("genericlist", {heading: "Vanasõnad", listData: data.split(";")});
		}
	});
});

//eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

//külastuste marsruudid
const visitRouter = require("./routes/visitRoutes");
app.use("/visits", visitRouter);

app.listen(5318);