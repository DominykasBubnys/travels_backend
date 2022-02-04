const express = require("express");
const {check} = require("express-validator");
const router = express.Router();

// Controllers

const PlaceController = require("../controllers/place-controller");
const UserController = require("../controllers/user-controller");

router.get("/", PlaceController.getPlaces);
router.post("/add-place", PlaceController.POST_addPlace);
router.patch("/update-place/:pid", PlaceController.POST_updatePlace);
router.get("/place/:pid", PlaceController.getPlaceById)
router.get("/user-places/:uid", PlaceController.getPlacesByUserId)
router.delete("/delete-place/:pid",PlaceController.DELETE_deletePlace)
router.post("/liked-place/:pid", PlaceController.POST_likedPlace);
module.exports = router;



