const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

// Routes
const PlaceRoute = require("./routes/place-routes");
const UserRoute = require("./routes/user-routes");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-methods","GET,POST,PATCH,DELETE");

    next();
})

app.use(UserRoute);

app.use(PlaceRoute);


mongoose.connect(`mongodb+srv://dombub1:dombub1@cluster0.4afhm.mongodb.net/travels?retryWrites=true&w=majority`)
.then(app.listen(process.env.PORT || 5000))
.catch(err => console.log("connecting mongoose returns an error: ", err));
