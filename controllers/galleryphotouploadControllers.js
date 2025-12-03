const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const watermarkFile = "./public/images/vp_logo_small.png";
const pool = require("../src/dbPool");
/* const dbInfo = require("../../../vp2025config");
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 }; */

//@desc Home page for uploading gallery phtos
//@route GET /galleryphotoupload
//@access public

const galleryphotouploadPage = (req, res)=>{
	res.render("galleryphotoupload");
};

//@desc Home page for adding gallery photos
//@route GET /galleryphotoupload
//@access public

const galleryphotouploadPagePost = async (req, res)=>{
	//let conn;
	console.log(req.body);
	console.log(req.file);
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		//kontrollin, kas vesimärgi fail on olemas
		const watermarkSettings = [{
            input: watermarkFile,
            gravity: "southeast"
        }];
		if (!await fs.access(watermarkFile).then(() => true).catch(() => false)) {
             console.log("Vesimärgi faili ei leitud!");
             // Tühjendame seaded, et vesimärki ei proovitaks lisada
             watermarkSettings.length = 0; 
        }
		console.log("Muudan suurust: 800X600");
		//loon normaalmõõdus foto (800X600)
		//await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		let normalImageProcessor = await sharp(req.file.destination + fileName).resize(800, 600).jpeg({quality: 90});
        console.log("Lisan vesi,ärgi" + watermarkSettings.length);    
        if (watermarkSettings.length > 0) {
            normalImageProcessor = await normalImageProcessor.composite(watermarkSettings);
        }
		await normalImageProcessor.toFile("./public/gallery/normal/" + fileName);
		//loon pisipildi (100X100)
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/" + fileName);
		//conn= await mysql.createConnection(dbConf);
		let sqlReq = "INSERT INTO galleryphotos (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		//Kuna kasutajakontosid ja nende id-sid veel pole, siis ...
		const userId = req.session.userId;
		const [result] = await pool.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Lisati foto id: " + result.insertId);
		res.render("galleryphotoupload");
	}
	catch(err){
		console.log(err);
		res.render("galleryphotoupload");
	}
	finally {
		/* if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		} */
	}
};

module.exports = {
	galleryphotouploadPage,
	galleryphotouploadPagePost
}