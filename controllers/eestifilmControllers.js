const dateEt = require("../src/dateTimeET");
const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 };

//@desc Home page for Estonian movie section
//@route GET /eestifilm
//@access public

const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

//@desc page for people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed
//@access public

const filmPeople = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows, dateEt: dateEt});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("filmiinimesed", {personList: [], dateEt: dateEt});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for adding people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAdd = (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
};

//@desc page for submitting people involved in Estonian movie industry
//@route GET /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
		return;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
		console.log("Salvestati kirje id: " + result.insertId);
		res.render("filmiinimesed_add", {notice: "Andmed edukalt salvestatud!"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for professions involved in movie industry
//@route GET /eestifilm/ametid
//@access public

const filmPosition = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM amet";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("ametid", {ametList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("ametid", {ametList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for adding professions involved in movie industry
//@route GET /eestifilm/amet_add
//@access public

const filmPositionAdd = (req, res)=>{
	res.render("amet_add", {notice: "Ootan sisestust!"});
};

//@desc page for submitting professions involved in movie industry
//@route GET /eestifilm/amet_add
//@access public

const filmPositionAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO amet (position_name, description) VALUES (?,?)";
	if(!req.body.positionInput){
		res.render("amet_add", {notice: "Andmed on vigased!"});
		return;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [result] = await conn.execute(sqlReq, [req.body.positionInput, req.body.descriptionInput]);
		console.log("Salvestati kirje id: " + result.insertId);
		res.render("amet_add", {notice: "Andmed edukalt salvestatud!"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("amet_add", {notice: "Tekkis tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for Estonian movies
//@route GET /eestifilm/film
//@access public

const film = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM movie";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("film", {filmList: rows});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("film", {filmList: []});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for adding Estonian movies
//@route GET /eestifilm/film_add
//@access public

const filmAdd = (req, res)=>{
	res.render("film_add", {notice: "Ootan sisestust!"});
};

//@desc page for submitting Estonian movies
//@route GET /eestifilm/film_add
//@access public

const filmAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO movie (title, production_year, duration, description) VALUES (?,?,?,?)";
	if(!req.body.titleInput || !req.body.productionInput || !req.body.durationInput || !req.body.filmDescriptionInput){
		res.render("film_add", {notice: "Andmed on vigased!"});
		return;
	}
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.productionInput, req.body.durationInput, req.body.filmDescriptionInput]);
		console.log("Salvestati kirje id: " + result.insertId);
		res.render("film_add", {notice: "Andmed edukalt salvestatud!"});
	}
	catch(err){
		console.log("Viga: " + err);
		res.render("film_add", {notice: "Tekkis tehniline viga!"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for relations between persons, movies and positions
//@route GET /eestifilm/seosed
//@access public

const filmRelation = async (req, res)=>{
	let conn;
	// T1: person_in_movie
    // T2: person
    // T3: movie
    // T4: amet
	const sqlReq = "SELECT T1.id, T1.role, T1.position_id, " + 
        "T2.first_name, T2.last_name, T3.title, T3.id AS movie_id, " +
        "T4.position_name " + 
        "FROM person_in_movie T1 " + 
        "JOIN person T2 ON T1.person_id = T2.id " + 
        "JOIN movie T3 ON T1.movie_id = T3.id " + 
        "JOIN amet T4 ON T1.position_id = T4.id " + 
        "ORDER BY T2.last_name, T3.title";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("seosed", {seosedList: rows, rezId: 2});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("seosed", {seosedList: [], rezId: 2});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
	}
};

//@desc page for adding relations between persons, movies and positions
//@route GET /eestifilm/seosed_add
//@access public

const filmRelationAdd = async (req, res) => {
    let conn;
    let personList = [];
    let filmList = [];
    let positionList = []; 
    const personSql = "SELECT id, first_name, last_name FROM person ORDER BY last_name";
    const movieSql = "SELECT id, title FROM movie ORDER BY title";
    const positionSql = "SELECT id, position_name FROM amet ORDER BY position_name";
    try {
        conn = await mysql.createConnection(dbConf);
        [personList] = await conn.execute(personSql);
        [filmList] = await conn.execute(movieSql);
        [positionList] = await conn.execute(positionSql);
        res.render("seosed_add", { 
            personList: personList, 
            filmList: filmList, 
            positionList: positionList, 
            notice: "Ootan sisestust!" 
        });
    } catch (err) {
        console.log("Viga: " + err);
        res.render("seosed_add", { 
            personList: [], 
            filmList: [], 
            positionList: [], 
            notice: "Andmebaasi viga!" 
        });
    } finally {
        if (conn) { await conn.end(); }
    }
};

//@desc page for submitting relations between persons, movies and positions
//@route GET /eestifilm/seosed_add
//@access public

const filmRelationAddPost = async (req, res) => {
    let conn;
    const sqlReq = "INSERT INTO person_in_movie (person_id, movie_id, position_id) VALUES (?, ?, ?)";
    if (!req.body.personSelect || !req.body.filmSelect || !req.body.positionSelect){
		res.render("seosed_add", {notice: "Andmed on vigased!"});
		return;
    }
    try {
        conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud");
        const [result] = await conn.execute(sqlReq, [
            req.body.personSelect,
            req.body.filmSelect,
            req.body.positionSelect
        ]);
        console.log("Salvestati kirje id: " + result.insertId);
		res.render("seosed_add", {notice: "Andmed edukalt salvestatud!"});
    }
	catch(err) {
        console.log("Viga: " + err);
		res.render("seosed_add", {notice: "Tekkis tehniline viga!"});
	}
	finally {
        if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		}
    }
};

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost,
	film,
	filmAdd,
	filmAddPost,
	filmRelation,
	filmRelationAdd,
	filmRelationAddPost
}