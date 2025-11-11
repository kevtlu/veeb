const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp2025config");
const textRef = "public/txt/vanasõnad.txt";
const app = express();
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 };
 const dbPool = mysql.createPool(dbConf);
 
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
 
app.get("/", async (req, res)=>{
	let latestPhoto = null;
    const privacy = 3;
    const sql = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy = ? AND deleted IS NULL)";
    try {
        const [results] = await dbPool.query(sql, [privacy]);
        if (results.length > 0) {
            latestPhoto = results[0];
        }
    }
	catch (err) {
        console.error("Andmebaasi viga foto laadimisel:", err);
    }
	res.render("index", {latestPhoto: latestPhoto});
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

//Galeriipildi ülesaadimise marsruudid
const galleryphotouploadRouter = require("./routes/galleryphotouploadRoutes");
app.use("/galleryphotoupload", galleryphotouploadRouter);

app.listen(5318);