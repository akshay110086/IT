const http = require("http");
const fs = require("fs");
const mysql = require("mysql");
const qs = require("querystring");
const { URLSearchParams } = require("url");

const hostname = "localhost";
const port = 3000;

function index(req, res) {
  fs.readFile("index.html", function (err, data) {
    res.write(data);
    return res.end();
  });
}

function showsignin(req, res) {
  fs.readFile("signin.html", function (err, data) {
    res.write(data);
    return res.end();
  });
}

function showsignup(req, res) {
  fs.readFile("signup.html", function (err, data) {
    res.write(data);
    return res.end();
  });
}

function dosignin(req, res) {
  var qs = new URLSearchParams(req.url.split("?")[1]);
  var username = qs.get("username");
  var passwd = qs.get("passwd");
  console.log(username, passwd);
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // port: 3000,
    password: "password",
    // password: "keerat123",
    database: "practicaldb",
  });

  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM user where user=? and passwd=?",
      [username, passwd],
      function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        if (result.length == 1) {
          res.write("<h1>Sign In Successful</h1>");
          res.end();
        } else {
          res.write("<h1>Sign In Failed</h1>");
          res.end();
        }
      }
    );
  });
}

function dosignup(req, res) {
  var qs = new URLSearchParams(req.url.split("?")[1]);
  var username = qs.get("username");
  var passwd = qs.get("passwd");
  var confpasswd = qs.get("confpasswd");
  // console.log("Body: " + body);

  if (passwd != confpasswd) {
    res.write("<h1>Password Mismatch</h1>");
    return res.end();
  }

  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    // port: 3000,
    password: "password",
    // password: "keerat123",
    database: "practicaldb",
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO user (user,passwd,confpasswd) VALUES (?,?,?)";
    con.query(sql, [username, passwd, passwd], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
      res.write("<h1>Congratulation! You have signed up successfully</h1>");
      res.end();
    });
  });
  // });
}

const server = http.createServer(onRequest);
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function onRequest(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/HTML");

  if (req.url == "/") {
    index(req, res);
  } else if (req.url.split("?")[0] == "/showsignin") {
    showsignin(req, res);
  } else if (req.url.split("?")[0] == "/dosignin") {
    dosignin(req, res);
  } else if (req.url.split("?")[0] == "/showsignup") {
    showsignup(req, res);
  } else if (req.url.split("?")[0] == "/dosignup") {
    dosignup(req, res);
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    return res.end("Page Not Found");
  }
}
