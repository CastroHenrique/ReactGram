const Photo = require("../models/Photo")
const User = require("../models/User")

const mongoose = require ("mongoose")

// Insert a photo, with an user related to it

const insertPhoto = async (req, res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser.id); 

    // Create a phot

    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    })

    // if photo was create successfully, return data
    if(!newPhoto) {
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente mais tarde."]
        });
        return;
    }

    res.status(201).json(newPhoto)
}


const deletePhoto = async (req, res) => {

    const {id} = req.params;
    const reqUser = req.user;
    
    try {
        const photo = await Photo.findById(mongoose.Types.ObjectId(id));
        // Check if photo belongs to user
        if(!photo) {
            res.status(404).json({errors: ["Foto não encontrada!"]});
            return;
        }
        // Check if photo belongs to user
        if(!photo.userId.equals(reqUser._id)) {
            res.status(422).json({errors: ["Houve um problema, por favor tente novamente mais tarde."]});
            return;
        } 
        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ id: photo._id, message: "Foto excluída com sucesso!" })

    } catch (error) {
            res.status(404).json({ errors: ["Foto não encontrada!"]});
            return;
        };
};

// Get all photos

const getAllPhotos = async(req, res) => {
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos)
}

// Get user photos

const getUserPhotos = async (req, res) => {
    const { id } = req.params;

    const photos = await Photo.find({ userId: id }).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos)
};

//Get photo by id

const getPhotoById = async (req, res) => {
    const {id} = req.params;   

    const photo = await Photo.findById(mongoose.Types.ObjectId(id));

    //Check if a photo exists
    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada!"]})
        return;
    };

    res.status(200).json(photo)
 
};


    //  ** Update a photo **

const updatePhoto = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

     // ** Check if photo exists **

    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada!"]});
        return;
    }

    // ** check if photo belongs to user **

    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde!"]});
        return;
    }

    if(title) {
        photo.title = title;
    }

    await photo.save()
    res.status(200).json({photo, message: "Foto atualizada com sucesso!"});    
};

// *** LIKE functionality ***

const likePhoto = async (req, res) => {
    const { id } = req.params;

    const reqUser = req.user;

    const photo = await Photo.findById(id);

    if(!photo) {
        res.status(404).json({errors: ["Foto não encontrada!"]});
        return;
    }

    // *** check if user already liked the photo ***
    if(photo.likes.includes(req._id)) {
        req.status(422).json({errors: ["Você ja curtiu a foto."]});
        return;
    }

    //  *** Put user id likes array ***

    photo.likes.push(reqUser._id)

    photo.save()

    res.status(200).json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida."})

};


module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
};