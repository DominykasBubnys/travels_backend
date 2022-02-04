const Place = require("../models/place")
const User = require("../models/user");

const getPlaces = async(req,res,next) => {

    try {
        const places = await Place.find();
        res.status(200).send({places});
    } catch (err) {
        res.status(501).send({message: "Error in fetching all places"});
    }

}

const getPlaceById = async(req,res,next) => {
    
    const placeId = req.params.pid;
    //const o_id = new ObjectId(placeId);


    try {
        const place = await Place.findById(placeId);

        res.status(200).send({place: place})

    } catch (err) {
        res.status(501).send({message: "Cannot get place by given ID"})
    }


}

const getPlacesByUserId = async(req,res,next) => {
    const userId = req.params.uid;

    try {
        const places = await Place.find({creator: userId});
        res.status(200).send({places});

    } catch (err) {
        res.status(501).send({message: "Failed to fetch user places"});
    }
}


// < CRUD OPERATIONS >

const POST_addPlace = async(req,res,next) => { // for adding new place to database...

    const { title, image, description, latitude, longitude, address, creator } = req.body;

    const createdPlace = new Place({
        title,
        description,
        image,
        address,
        location: {
            lat: latitude,
            lng: longitude
        },
        creator,
    })
      
    let user;

    try{
        user = await User.findById(creator);

    }catch(err){
        res.status(501).send(err);        
    }

    try {
        await createdPlace.save();
        await user.places.push(createdPlace);
        await user.save();
        res.status(200).send(user);
    } catch (err) {
        res.status(501).send({message: "error in adding new place"});
    }

}


const POST_updatePlace = async(req,res,next) => {
    const {title, description} = req.body;
    const placeId = req.params.pid;

    try {
        const place = await Place.findById(placeId);

        place.title = title,
        place.description = description;

        await place.save();

    } catch (err) {
        console.log(err);    
    }

    res.status(200).json({message: "Updated!"});
}

const DELETE_deletePlace = async (req,res,next) => {
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (err) {
        res.status(501).send("Cannot found place with given ID");
    }

    if (!place) {
        res.status(501).send("Cannot found place with given ID");
    }

    try {
        await place.remove();
        place.creator.places.pull(place);
        await place.creator.save();
    } catch (err) {
        res.status(501).send("Cannot remove place with provided id");
    }
    
    res.status(200).json({ message: 'Deleted place.' });

}

// < / CRUD OPERATIONS >

// < EXTRA OPERATIONS >

const POST_likedPlace = async(req,res,next) => {

    const { reactedUserId } = req.body;
    
    const placeId = req.params.pid;

    try {
        
        const likedPlace = await Place.findById(placeId);

        if(!likedPlace.likedBy.includes(reactedUserId)){
            likedPlace.likes = likedPlace.likes + 1;
            likedPlace.likedBy.push(reactedUserId);
        }else{
            likedPlace.likes = likedPlace.likes - 1;
            likedPlace.likedBy.remove(reactedUserId);
        }

        await likedPlace.save();
        res.status(200).send({place: likedPlace});

    } catch (err) {
        res.status(501).send({message: "Unexpected error in server!"});
        console.log(err);
    }

}


exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.POST_addPlace = POST_addPlace;
exports.POST_updatePlace = POST_updatePlace;
exports.DELETE_deletePlace = DELETE_deletePlace;
exports.POST_likedPlace = POST_likedPlace;