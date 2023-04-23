const express = require("express")
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config();

const dbURL =  process.env.DB_USERNAME;

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('dbURL');

    // mongodb+srv://dagmfre:dag%4013645440@firstcluster.rkrulns.mongodb.net/todolistDB
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your todolist!"
})
const item2 = new Item({
    name: "Hit the + button to add a new item,"
})
const item3 = new Item({
    name: "Test"
})
const defaultItems = [item1, item2,item3];

const listSchema = mongoose.Schema({
    name: String,
    lists: [itemSchema]
})

const List = mongoose.model("List", listSchema)

app.get("/", (req, res)=>{
    Item.find()
    .then(result => {
        if (result.length === 0) {
            Item.insertMany(defaultItems)
            .then(() => {
                res.redirect("/")
            })
        } else {
            res.render("index", {listTitle: "Today", userInput: result})
        }
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });
})

app.get("/about", (req, res)=>{
    res.render("about")
})

app.get("/:userID", (req, res)=>{
    const params = _.capitalize(req.params.userID)
    List.findOne({name: params})
    .then(result => {
        if (!result) {
            const newList = new List({
                name: params,
                lists: defaultItems
            })
            newList.save()
            res.redirect("/" + params)
        }else{
            res.render("index", {listTitle: result.name, userInput: result.lists})
        }
    })
    .catch(err => {
        console.log(err);
    });
})

app.post("/", (req, res) =>{
    let userInput = req.body.userInput;
    let list = req.body.List

    const userItem = new Item ({
            name: userInput,
        })

    if(list === "Today"){
        userItem.save();
        res.redirect("/")
    } else{
        List.findOne({name: list})
        .then(result => {
            result.lists.push(userItem)
            result.save()
            res.redirect("/" + list)
        })
    }

})

app.post("/delete", (req, res) =>{
    const checkedName = req.body.checkbox;
    let listTitle = req.body.listTitle

    if (listTitle === "Today") {
        Item.findOneAndDelete({name: checkedName})
        .then(() => {
            res.redirect("/")
        })
        .catch(err => {
            console.log(err);
        });
    } else {
        List.findOneAndUpdate(
            {name: listTitle},
            {$pull:{lists:{name: checkedName}}}
        )
        .then(() => {
            res.redirect("/" + listTitle)
        })
    }
})

app.listen(3000, (req,res) =>{
    console.log("Hello, server started on port 3000")
})