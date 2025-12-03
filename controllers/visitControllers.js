const fs = require("fs");
const dateEt = require("../src/dateTimeET");
const mysql = require("mysql2/promise");
const pool = require("../src/dbPool");
/* const dbInfo = require("../../../vp2025config");
const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 }; */

//@desc page for registering visitors
//@route GET /visits
//@access public

const registerPage = (req, res)=>{
	res.render("regvisit");
};

//@desc page for submitting registered visitors
//@route GET /visits
//@access public

const registerPagePost = (req, res)=>{
	console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file) => {
		if(err) {
			throw(err);
		}
		else {
			const logEntry = req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " kell " + dateEt.time() + ";";
			fs.appendFile("public/txt/visitlog.txt", logEntry, (err)=>{
				if(err) {
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.redirect("/visits/log");
				}
			});
		}
	});
};

//@desc page for showing visitor log
//@route GET /visits/log
//@access public

const logPage = (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data) =>{
		if(err) {
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			let tempListData = data.split(";");
			for(let i = 0; i < tempListData.length - 1; i ++){
				listData.push(tempListData[i]);
			}
			res.render("genericlist", {heading: "Registreeritud külastused", listData: listData});
		}
	});
};

module.exports = {
	registerPage,
	registerPagePost,
	logPage
}