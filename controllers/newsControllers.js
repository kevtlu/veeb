/* const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const dbInfo = require("../../../vp2025config");
const sharp = require("sharp");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for news
//@route GET /news
//@access public
const newsHome = async (req, res) => {
	let conn;
	try{
		conn = await mysql.createConnection(dbConf);
		const sql = "SELECT * FROM news WHERE expired > ? ORDER BY id DESC"
		const [newsItems] = await conn.execute(sql, [new Date()]);
		res.render("list_news", {news: newsItems });
	}
	catch (err) {
		console.error("Viga uudiste kuvamisel: " + err);
		res.render("list_news", { news: [] });
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasi ühendus suletud!")
		}
	}
};

//@desc Page for adding news
//@route GET /news/add
//@access public
const addNewsPage = (req, res) => {
	res.render("add_news", { notice: "Lisa uus uudis" });
};

//@desc Page for adding news
//@route POST /news/add
//@access public
const addNewsPost = async (req, res) => {
	let conn;
	const { titleInput, contentInput, expiredInput, altInput } = req.body;
	const userId = 1;
	let photoFilename = null;
	let originalName = null;
	let altText = null;
	let finalOriginalPath = null;

	if (!titleInput || !contentInput || !expiredInput) {
		if (req.file) { await fs.unlink(req.file.path); }
		return res.render("add_news", { notice: "Viga: Pealkiri, sisu ja aegumiskuupäev on kohustuslikud! "});
	}

	//pilditöötlus
	if (req.file) {
		photoFilename = 'news_' + Date.now() + '.jpg';
		originalName = req.file.originalname;
		altText = altInput || "Uudise pilt";

		finalOriginalPath = req.file.destination + photoFilename;

		try {
			await fs.rename(req.file.path, finalOriginalPath);
			await sharp(finalOriginalPath).resize({ width: 800 }).jpeg({ quality: 90 }).toFile("./public/newsphotos/normal/" + photoFilename);
			await sharp(finalOriginalPath).resize({ width: 150, height: 150, fit: 'cover' }).jpeg({ quality: 90 }).toFile("./public/newsphotos/thumbs/" + photoFilename);
		}
		catch(err) {
			console.error("Viga pildi töötlemisel: " + err);
			if (finalOriginalPath) { await fs.unlink(finalOriginalPath).catch(e => console.error(e)); }
			await fs.unlink(req.file.path).catch(e => console.error(e));
			return res.render("add_news", { notice: "Viga pildi töötlemisel." });
		}
	}
	try {
		conn = await mysql.createConnection(dbConf);
		const sql = "INSERT INTO news (title, content, expired, user_id, filename, origname, alttext) VALUES (?,?,?,?,?,?,?)";
		await conn.execute(sql, [titleInput, contentInput, expiredInput, userId, photoFilename, originalName, altText]);
		console.log("Uudis salvestatud!");
		res.redirect("/news")
	}
	catch (err) {
		console.error("Viga uudise salvestamisel andmebaasi: " + err);
		if (req.file && finalOriginalPath) {
			try {
				await fs.unlink(finalOriginalPath);
				await fs.unlink("./public/newsphotos/normal/" + photoFilename);
				await fs.unlink("./public/newsphotos/thumbs/" + photoFilename);
			}
			catch (e) { console.error("Veajärgne piltide kustutamine ebaõnnestus!", e); }
		}
		res.render("add_news", {notice: "Tekkis tehniline viga salvestamisel!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasi ühendus suletud!")
		}
	};
};

module.exports = {
	newsHome,
	addNewsPage,
	addNewsPost
}; */