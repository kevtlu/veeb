const mysql = require("mysql2/promise");
const argon2 = require("argon2");
const validator = require("validator");
const pool = require("../src/dbPool");
//const dbInfo = require("../../../vp2025config");
/* const dbConf = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
 }; */

//@desc page for creating user account
//@route GET /signup
//@access public

const signupPage = (req, res)=>{
	res.render("signup", {notice: "Ootan andmeid!"});
};

//@desc page for creating user account
//@route POST /signup
//@access public

const signupPagePost = async (req, res)=>{
	//let conn;
	//console.log(req.body);
	//andmete lihtsam valideerimine
	/* if(
		!req.body.firstNameInput ||
	    !req.body.lastNameInput ||
	    !req.body.birthDateInput ||
	    !req.body.genderInput ||
	    !req.body.emailInput ||
	    req.body.passwordInput.length < 8 ||
	    req.body.passwordInput !== req.body.confirmPasswordInput
	){
	  let notice = "Andmeid on puudu või need pole korrektsed!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	  } */
	  
	//puhastame andmed
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;
	
	//kas kõik oluline on olemas
	if(!firstName ||
	!lastName ||
	!birthDate ||
	!gender ||
	!email ||
	!password ||
	!confirmPassword){
	  let notice = "Andmeid on puudu!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	
	//kas email on korras
	if(!validator.isEmail(email)){
	  let notice = "E-maili aadress pole korrektne!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	
	//kas sünnikuupäev on korras
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)){
	  let notice = "Sünnikuupäev pole realistlik!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	
	//kas parool on piisavalt tugev
	//reeglid parooli kohta
	const passwordOptions = {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0};
	if(!validator.isStrongPassword(password, passwordOptions)){
	  let notice = "Parool pole piisavalt tugev!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	
	//kas paroolid klapivad
	if(password !== confirmPassword){
	  let notice = "Paroolid ei klapi!";
	  console.log(notice);
	  return res.render("signup", {notice: notice});
	}
	
	try {
		//conn = await mysql.createConnection(dbConf);
		//kontrollime ega sellise emailiga kasutajat juba olemas pole
		let sqlReq = "SELECT id FROM users_aa WHERE email = ?"
		//const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		const [users] = await pool.execute(sqlReq, [req.body.emailInput]);
		if(users.length > 0){
			let notice = "Sellise e-maili aadressiga kasutaja on juba olemas!";
			console.log(notice);
			return res.render("signup", {notice: notice});
		}
		//krüpteerime parooli
		const pwdHash = await argon2.hash(req.body.passwordInput);
		sqlReq = "INSERT INTO users_aa (first_name, last_name, birth_date, gender, email, password) VALUES (?,?,?,?,?,?)";
		const [result] = await pool.execute(sqlReq, [
			req.body.firstNameInput,
			req.body.lastNameInput,
	        req.body.birthDateInput,
	        req.body.genderInput,
	        req.body.emailInput,
		    pwdHash
		]);
		//console.log();
		res.render("signup", {notice: "Konto loodud!"});
	}
	catch(err){
		console.log(err);
		res.render("signup", {notice: "Tehniline viga!"});
	}
	finally {
		/* if(conn){
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
		} */
	}
};

module.exports = {
	signupPage,
	signupPagePost
}