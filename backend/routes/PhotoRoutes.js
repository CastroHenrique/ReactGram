const express = require("express");
const router = express.Router();

//  **  Controller  **

const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
} = require("../controllers/PhotoController");

//  **  Middlerwares  **

const { photoInsertValidations, photoUpdateValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidations");
const { imageUpload } = require("../middlewares/imageUpload");

//  **  Routes  **

router.post( "/", authGuard, imageUpload.single("image"), photoInsertValidations(), validate, insertPhoto);
router.delete("/:id", authGuard, deletePhoto);
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
router.get("/:id", authGuard, getPhotoById);
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.put("/like/:id", authGuard, likePhoto);

module.exports = router;
