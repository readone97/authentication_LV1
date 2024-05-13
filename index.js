import express from "express";
import bodyParser from "body-parser";
import pg from "pg"


const app = express();
const port = 3000;


const db = new pg.Clinet({
  user: "postgres", //set ur user
  host: "localhost",
  database: "secrets", // set the name of the database
  password: "12345", // set ur password
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  try{
    const checkResult = await db.query("SELCECT FROM * users WHERE email= $1",[email]);

    if (checkResult.rows.length>0) {

      res.send("Email already exit try logging in")
      
    } else {

      const result = await db.query(
        "INSERT INTO users(email,password) VALUES ($1, $2)"
        [email,password]
      );
      console.log(result);
      res.render("secrets.ejs");
      
    }

  } catch(error){
    console.log(error)

  }
 

  
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try{
    const result = await db.query("SELCECT FROM * users WHERE email= $1",[email])

    if (result.rows.length >0 ){

      const user = user.rows[0];
      const userPassword = user.password;
        if(password === userPassword){
          res.render("secrets.ejs")
        } else{
          res.send("incorrect password")
        }
    }else{
      res.send("user not found")
    }

  } catch(err){
    console.log(err)
  }

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
