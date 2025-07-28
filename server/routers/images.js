const imageRouter = require('express').Router()
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')

const Image = require('../models/image')
const User = require('../models/users')
const ChatUser = require('../models/chatUsers')
const ChatMessage = require('../models/chatMessages')
const Recipient = require('../models/recipients')
const Provider = require('../models/providers')
const fs = require("fs");



// Set Storage Engine
const storage = multer.diskStorage({
    //destination: './public/uploads/',
    destination: (req, file, cb) => {
        cb (null, './uploads')
    },
    filename: (req, file, cb) => {
        //const fileName = file.originalname.toLowerCase().split(' ').join('-')
        //cb(null, file.fieldname + '-' + Date.now() +
        //path.extname(file.originalname))
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
    }

})

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}) //.single('file')

// optional function to return new File Name (need to learn how i'ts working)
const newFilenameFunction = (og_filename, options) => {
    const newname =
        og_filename.split(".").slice(0, -1).join(".") +
        Date.now();
    return newname;
};







const chatStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb (null, './server/uploads/chat_images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + (file.originalname).toLowerCase())
    }
})

const chatUpload = multer({
    storage: chatStorage,
    //limits: { fileSize: 1000000},
    fileFilter: ( req, file, cb ) => {
        checkFileType(file, cb)
    },

})


imageRouter.post('/chat-img', chatUpload.single('file'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    console.log('filename:', req.file.filename)
    console.log("Chat message id: " + req.params.message_id);

    try {
        // const message = await ChatMessage.findByIdAndUpdate(
        //     req.params.message_id, {image: req.file.filename}, {new: true}
        // )
        // res.send(message);

        const result = new Image({
            _id: new mongoose.Types.ObjectId(),
            name: req.file.filename,  //req.body.name,
            image: url + '/uploads/chat_images/' + req.file.filename
        })

        await result.save();

        res.status(201).json({
            message: 'Img added successfully',
            imgCreated: {
                _id: result._id,
                image: result.image,
                name: result.name
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err.message
        })
    }
})


imageRouter.delete('/:id/remove_chat_image', async (req, res) => {
    const image = await Image.findOne({_id: req.params.id});
    try {


        fs.unlinkSync('./server/uploads/chat_images/' + image.name);


        await Image.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (err) {
        res.status(500).send({
            message: "No chat img deleted!!" + err.message
        })
        console.log("Error: " + err.message)
    }
})







const bookingStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb (null, './server/uploads')
    },
    filename: (req, file, cb) => {
        //const fileName = file.originalname.toLowerCase().split(' ').join('-')
        //cb(null, file.fieldname + '-' + Date.now() +
        //path.extname(file.originalname))
        cb(null, file.fieldname + '-' + Date.now() + '-' + (file.originalname).toLowerCase())
    }
    // imageOptions: {
    //     fileFormat: 'png',
    //     quality: 80,
    //     resize: {width: 300, height: 300}
    // },
})

//3103850
// 1000000 bytes is 1 MB 3200000 = 3,05 MB
const bookingUpload = multer({
    storage: bookingStorage,
    limits: { fileSize: 3200000},
    fileFilter: ( req, file, cb ) => {
        checkFileType(file, cb)
    },

})

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb (null, './server/uploads/avatar')
    },
    filename: (req, file, cb) => {
        //const fileName = file.originalname.toLowerCase().split(' ').join('-')
        //cb(null, file.fieldname + '-' + Date.now() +
        //path.extname(file.originalname))
        cb(null, file.fieldname + '-' + Date.now() + '-' + (file.originalname).toLowerCase())
    }


    // imageOptions: {
    //     fileFormat: 'png',
    //     quality: 80,
    //     resize: {width: 200, height: 200}
    // },

    //filename: newFilenameFunction
})



const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 1000000},
    fileFilter: ( req, file, cb ) => {
        checkFileType(file, cb)
    },

})



// Check File Type
const checkFileType = (file, cb) => {
    // Allowed extencion
    const filetypes = /jpeg|jpg|png|gif/
    // Check ext
    const extname = filetypes.test(path.extname( file.originalname).toLowerCase() )
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    }else {
        cb('Error: Images Only!')
    }
}

const proStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb (null, './server/uploads/pro')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '-' + (file.originalname).toLowerCase())
    }
})

const proUpload = multer({
    storage: proStorage,
    //limits: { fileSize: 1000000},
    fileFilter: ( req, file, cb ) => {
        checkFileType(file, cb)
    },

})
// async???
imageRouter.post('/:proID/pro-ref-img', proUpload.single('file'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    console.log('filename:', req.file.filename)
    //res.json({file: req.file})
    console.log("Provider id: " + req.params.proID);
    const pro = Provider.findById(req.params.proID);
    console.log("Image name: " + req.file.filename)

    const proRefImage = new Image({
        _id: new mongoose.Types.ObjectId(),
        name: req.file.filename,  //req.body.name,
        image: url + '/uploads/pro/' + req.file.filename,
        size: req.file.size
    })

    // pro.reference = pro.reference.concat(result._id);
    // await pro.save();

    await proRefImage.save().then(result  => {


        res.status(201).json({
            message: 'Img added successfully',
            imgCreated: {
                _id: result._id,
                image: result.image,
                name: result.name
            }
        })
    }).catch (err => {
        console.log("Error " + err.message)

        res.status(500).json({

            error: err
        })
    })
})

imageRouter.put('/:id/edit-pro-ref-image', proUpload.single('file'), async (req, res) => {
    const body = req.body
    const url = req.protocol + '://' + req.get('host');
    const change = await Image.findOne({_id: req.params.id});
    try {
        await fs.unlinkSync('./server/uploads/pro/' + change.name);
        const newImage = {
            name: req.file.filename,
            image: url + '/uploads/pro/' + req.file.filename
        }

        const updatedImage = await Image.findByIdAndUpdate(
            req.params.id, newImage, { new: true }
        )
        //fs.unlinkSync('./uploads/' + image.name);

        //res.status(200).json(updatedImage.toJSON())
        res.status(200).send(updatedImage);
    }catch (err) {
        //res.status(500).send("--ERROR--")
        console.log('error: ', err)
    }
})

imageRouter.delete('/:id/del-pro-ref-image/:proID', async (req, res) => {
    //const fs = require("fs");
    const image = await Image.findOne({_id: req.params.id});
    try {

        console.log("Pro id:: " + req.params.proID + " " + image.name);
        fs.unlinkSync('./server/uploads/pro/' + image.name);

        await Provider.findOneAndUpdate(
            { _id: req.params.proID },
            { $pull: { reference: req.params.id } }
        )
        await Image.findByIdAndDelete(req.params.id)

        res.status(204).end()
    } catch (err) {
        res.status(500).send({
            message: "No pro file deleted!!" + err.message
        })
        console.log("Error: " + err.message)
    }


})

imageRouter.post('/', bookingUpload.single('file'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    console.log('filename:', req.file.filename)
    //res.json({file: req.file})

    const img = new Image({
        _id: new mongoose.Types.ObjectId(),
        name: req.file.filename,  //req.body.name,
        image: url + '/uploads/' + req.file.filename
    })

    img.save().then(result => {

        res.status(201).json({
            message: 'Img added successfully',
            imgCreated: {
                _id: result._id,
                image: result.image,
                name: result.name
            }
        })
    }).catch (err => {
        console.log(err)
        console.log("ERROR: " + err.message);
        res.status(500).json({
            error: err
        })
    })
})
//
imageRouter.put('/:id', bookingUpload.single('file'), async (req, res) => {
    const body = req.body
    const url = req.protocol + '://' + req.get('host');
    const image = await Image.findOne({_id: req.params.id});
    try {
        await fs.unlinkSync('./server/uploads/' + image.name);
        const newImage = {
            name: req.file.filename,
            image: url + '/uploads/' + req.file.filename
        }

        const updatedImage = await Image.findByIdAndUpdate(
            req.params.id, newImage, { new: true }
        )
        //fs.unlinkSync('./uploads/' + image.name);

        //res.status(200).json(updatedImage.toJSON())
        res.status(200).send(updatedImage);
    }catch (err) {
        //res.status(500).send("--ERROR--")
        console.log('error: ', err)
    }
})




imageRouter.post('/:id/avatar', avatarUpload.single('file'), async (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')
    const user = await User.findById(req.params.id);
    //const chatuser = await ChatUser.findOne({username: user.username})
    console.log("FILENAME " + req.file.filename);
    //const cu = await ChatUser.

    try {

        const img = {
            name: req.file.filename,  //req.body.name,
            image: url + '/uploads/avatar/' + req.file.filename
        }

        //fs.unlinkSync("file" + '-' + Date.now() + '-' + req.file.filename)

        user.avatar = img;
        // chatuser.avatar = req.file.filename;
        // await chatuser.save();

        //await ChatUser.updateMany({ username: user.username }, { $set: { avatar: req.file.filename } });
        await user.save();

        //res.send("User avatar is added successfully!")
        res.send("User avatar is added successfully!")
    } catch (err) {
        console.log("Error to load avatar! " + err);
        //res.status(500).send({Error: err.message});
        res.send({error: err.message});
    }

})

imageRouter.post('/:userId/update_avatar', avatarUpload.single('file'), async (req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const user = await User.findById(req.params.userId);
    //const body = req.body;
    let name = "";
    try {
        if (user.avatar) {
            name = user.avatar.name;

        }

        console.log("User avatar name " + name);
        const newImg = {
            name: req.file.filename,  //req.body.name,
            image: url + '/uploads/avatar/' + req.file.filename
        }

        user.avatar = newImg;

        fs.unlinkSync('./server/uploads/avatar/' + name);
        await user.save();


        //res.send("User avatar is updated successfully!")
    } catch (err) {
        //res.status(500).send("Error to update avatar");
        res.send({error: err.message});
    }
})


imageRouter.get('/', async (req, res) => {
    const images = await Image.find({})
    res.send(images)

})
// Delete recipient booking image
imageRouter.delete('/:id/delClientImg/:recipientId', async (req, res) => {
    //const fs = require("fs");
    const image = await Image.findOne({_id: req.params.id});
    try {

        console.log("Recipient id:: " + req.params.recipientId)
        fs.unlinkSync('./server/uploads/' + image.name);

        await Recipient.findOneAndUpdate(
            { _id: req.params.recipientId },
            { $pull: { image: req.params.id } }
        )
        await Image.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (err) {
        res.status(500).send({
            message: "No file deleted!!" + err.message
        })
        console.log("Error: " + err.message)
    }


})

// Delete recipient images ( from deleted recipient )
imageRouter.delete('/:id/delAllClientBookingImages', async (req, res) => {
    //const fs = require("fs");
    const image = await Image.findOne({_id: req.params.id});
    try {


        fs.unlinkSync('./server/uploads/' + image.name);


        await Image.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (err) {
        res.status(500).send({
            message: "No file xxx deleted!!" + err.message
        })
        console.log("Error: " + err.message)
    }


})

module.exports = imageRouter