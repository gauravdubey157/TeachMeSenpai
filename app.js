//jshint esversion:8

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
require('dotenv').config();

const aboutContent = "Web platform to enhance community-driven learning, enabling users to share and explore tips, and book recommendations on a variety of technical topics, particularly DSA and Web Development.";

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();

app.use(express.urlencoded({extended: true})); // Use Express's built-in method
app.use(express.static("public"));
app.set('view engine', 'ejs');

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/explore", async function(req, res) {
  try {
    const posts = await Post.find({});
    res.render("explore", {posts: posts});
  } catch (err) {
    console.log(err);
    res.send("Error retrieving posts.");
  }
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", async function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect("/explore");
  } catch (err) {
    console.log(err);
    res.send("Error saving post.");
  }
});

app.get("/posts/:postId", async function(req, res) {
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({_id: requestedPostId});
    res.render("post", {title: post.title, content: post.content});
  } catch (err) {
    console.log(err);
    res.send("Error finding the post.");
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
