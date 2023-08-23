//jshint esversion:6
// read chain routing?

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { stringify } = require("querystring");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//TODO
app.post("/articles", function (req, res) {
  const title = req.body.title;
  const content = req.body.content;

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  });

  newArticle.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Added Succesfully");
    }
  });
});

app.delete("/articles", function (req, res) {
  Article.deleteMany({}, function (err) {
    if (!err) {
      res.send("sucessfully deleted");
    } else {
      res.send("err occupiedd");
    }
  });
});

app
  .route("/articles/:articleName")
  //  const name =req.params.articleName;

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleName },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("no articles matching");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.updateOne(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("SucessFully Updated");
        } else {
          res.send("err occupied");
        }
      }
    );
  });

app.patch("/articles/:articleName", function (req, res) {
  Article.updateOne({ title: req.params.articleName }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Sucessfully Updated");
    }
  });
});

app.get("/", function (req, res) {
  res.send("You Are at Home");
});

app.get("/articles", function (req, res) {
  Article.find({}, function (err, foundArticles) {
    res.send(foundArticles);
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
