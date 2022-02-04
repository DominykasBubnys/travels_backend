const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 5},
    image: {type: String, required: true},
    places: [{type: Schema.Types.ObjectId, required: true, ref: "Place"}],
    favorites: [{type: Schema.Types.ObjectId, ref: "Place"}]
})


module.exports = mongoose.model("User", userSchema);