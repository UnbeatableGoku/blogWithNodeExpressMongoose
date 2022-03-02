const express = require("express")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const app = express()
let articles = []
let date = new Date()
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(date.toLocaleDateString('IST', options));

const startingContent = "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Contenthere, content here ', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for .t is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Contenthere, content here ', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for "

app.set('view engine', "ejs")


app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



mongoose.connect("mongodb://localhost:27017/personalBlogDB")

const articleSchema = {
    title: {
        type: String,
        required: true
    },
    descriptions: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}

const Article = mongoose.model("Article", articleSchema)


app.get("/", function(req, res) {
    Article.find({}, function(err, articles) {
        res.render("articles/index", {
            articles: articles,
            homeStartingContent: startingContent
        })
    })
})

app.get("/articles/new", function(req, res) {
    res.render("articles/new")
})

app.post("/articles", function(req, res) {
    const article = new Article({
        title: req.body.title,
        date: new Date(),
        descriptions: req.body.descriptions,
        markdown: req.body.markdown
    })
    article.save()
    articles.push(article)
    res.redirect("/")
})

app.get("/articles/selected/:titles", function(req, res) {
    const requestedTitle = req.params.titles;
    articles.forEach(function(article) {
        const storedTitle = article.title
        if (storedTitle === requestedTitle) {
            res.render("articles/selected", {
                title: article.title,
                date: article.date,
                markdown: article.markdown
            })
        } else {
            console.log("noooooo");
        }

    })
})

app.delete("/articles/:id", function(req, res) {
    const requestedItem = req.params.id;
    Article.findByIdAndRemove(requestedItem, function(err) {
        if (!err) {
            console.log("deleted!!!");
            res.redirect("/")
        }
    })
})
app.listen(3000, () => {
    console.log("Connected to localhost 3000");
})