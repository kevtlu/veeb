const express = require("express");
require("dotenv").config();
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const session = require("express-session");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const checkLogin = require("./src/checkLogin");
const pool = require("./src/dbPool");
const textRef = "public/txt/vanasõnad.txt";
const app = express();
//sessiooni kasutamine
//app.use(session({secret: dbInfo.configData.sessionSecret, saveUninitialized: true, resave: true}));
app.use(session({secret: process.env.SES_SECRET, saveUninitialized: true, resave: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));

/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 }; */
 
 app.get("/", async (req, res)=>{
	//let conn;
	let latestNews = null;
	try {
		//conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
		const privacy = 3;
		//const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		const [rows, fields] = await pool.execute(sqlReq, [privacy]);
		//console.log(rows);
		let imgAlt = "Avalik foto";
		let imgFile = "images/otsin_pilte.jpg";
		if(rows.length > 0){
		    if(rows[0].alttext != ""){
		        imgAlt = rows[0].alttext;
		    }
		    imgFile = "gallery/normal/" + rows[0].filename;
		}
		const newsSql = "SELECT title, content, added FROM news WHERE expired > CURDATE() ORDER BY added DESC LIMIT 1";
		const [newsRows] = await pool.execute(newsSql);
		if (newsRows.length > 0) {
			latestNews = newsRows[0];
		}
		res.render("index", {
		    imgFile: imgFile, 
		    imgAlt: imgAlt,
		    latestNews: latestNews
		});
	}
	catch(err){
		console.log(err);
		//res.render("index");
		res.render("index", {imgFile: "images/otsin_pilte.jpg", imgAlt: "Tunnen end, kui pilti otsiv lammas ...", latestNews: null});
	}
	finally {
		/* if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		} */
	}
});

//sisseloginud kasutajate avaleht
app.get("/home", checkLogin.isLogin, (req, res)=>{
	//console.log("Sisse logis kasutaja id: " + req.session.userId);
	const userName = req.session.userFirstName + " " + req.session.userLastName;
	res.render("home", {userName: userName});
});

//väljalogimine
app.get("/logout", (req,res)=>{
	//tühistame sessiooni
	req.session.destroy();
	res.redirect("/");
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

//uudiste osa eraldi marsruutide failiga
const newsRouter = require("./routes/newsRoutes");
app.use("/news", newsRouter);

//kasutajakonto loomise marsruudid
const signupRouter = require("./routes/signupRoutes");
app.use("/signup", signupRouter);

//sisselogimise marsruudid
const signinRouter = require("./routes/signinRoutes");
app.use("/signin", signinRouter);

app.listen(5318);