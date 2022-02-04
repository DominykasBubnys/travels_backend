const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema(
    {
        title: {type:String, required:true},
        description: {type:String, required:true},
        image: {type:String, required:true},
        address: {type:String, required:true},
        location: {
            lat: {type:Number, required:true},
            lng:{type:Number, required:true}
        },
        likes: {type: Number, default: 0},
        likedBy: [{type: Schema.Types.ObjectId, ref: "User"}],
        creator:{type: Schema.Types.ObjectId, required: true, ref: "User"}
    }
)

module.exports = mongoose.model("Place", placeSchema);