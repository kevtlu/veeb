const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");
const watermarkFile = "./public/images/vp_logo_small.png";
const fs = require("fs/promises");
const path = require("path");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for news section
//@route GET /news
//@access public

const newsHome = (req, res)=>{
	res.render("news");
};

//@desc page for adding news
//@route GET /news/addnews
//@access public

const addNewsPage = (req, res)=>{
	res.render("addnews", {errorMsg: ""});
};

//@desc page for uploading gallery pictures
//@route POST /news/addnews
//@access public

const addNewsPagePost = async (req, res)=>{
	let conn;
	let photoFileName = null;
	let photoOriginalName = null;
	console.log(req.body);
	console.log(req.file);
	
	try {
		conn = await mysql.createConnection(dbConf);
		if(req.file){
		  const oldPath = req.file.path;
		  photoOriginalName = req.file.originalname;
		  const extension = path.extname(photoOriginalName);
		  photoFileName = "news_" + Date.now() + extension;
		  const newPath = path.join(path.dirname(oldPath), photoFileName);
		  await fs.rename(oldPath, newPath);
	  }
	const sql = "INSERT INTO news (title, content, expired, user_id, filename, origname, alttext) VALUES (?, ?, ?, ?, ?, ?, ?)";
	const data = [
		  req.body.titleInput, 
		  req.body.newsInput, 
		  req.body.expireInput,
		  1,
		  photoFileName,
		  photoOriginalName,
		  req.body.altTextInput || null
	    ];  
		await conn.execute(sql, data);
		res.redirect("/news");
	}
	catch(err) {
	  console.log(err);
	  if(req.file && req.file.path){
		  await fs.unlink(req.file.path).catch(e => console.log("Faili kustutamine ebaõnnestus", e));
	  }
	  res.render("addnews", {errorMsg: "Uudise salvestamisel tekkis viga!"});
	}
	finally {
	  if(conn){
		await conn.end();
		console.log("Andmebaasiühendus suletud!");
	  }
	}
	
};

//@desc page news list
//@route GET /news/read
//@access public

const newsListPage = async (req, res)=>{
	let conn;
	let newsData = [];
	try {
		conn = await mysql.createConnection(dbConf);
		const sql = "SELECT id, title, content, filename, alttext, added FROM news WHERE expired > CURDATE() ORDER BY added DESC";
		const [rows] = await conn.execute(sql);
		newsData = rows;
		res.render("newslist", {newsData: newsData});
	}
	catch (err) {
		console.log(err);
		res.render("newslist", {newsData: [], error: "Uudiste lugemisel tekkis viga."});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

module.exports = {
	newsHome,
	addNewsPage,
	addNewsPagePost,
	newsListPage
};