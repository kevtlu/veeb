const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasõnad.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 };
 
 app.get("/", async (req, res)=>{
	let conn;
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let imgAlt = "Avalik foto";
		if(rows[0].alttext != ""){
			imgAlt = rows[0].alttext;
		}
		res.render("index", {imgFile: "gallery/normal/" + rows[0].filename, imgAlt: imgAlt});
	}
	catch(err){
		console.log(err);
		//res.render("index");
		res.render("index", {imgFile: "images/otsin_pilte.jpg", imgAlt: "Tunnen end, kui pilti otsiv lammas ..."});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
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

//galeriipildi ülesaadimise marsruudid
const galleryphotouploadRouter = require("./routes/galleryphotouploadRoutes");
app.use("/galleryphotoupload", galleryphotouploadRouter);

//fotogalerii marsruudid
const photogalleryRouter = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRouter);

//kasutajakonto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

app.listen(5318);