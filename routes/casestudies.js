//casestudy routes
const express = require("express");
const Casestudy = require("./../models/Casestudy")
const router = express.Router();
const multer = require("multer");

//define storage for the images
const storage = multer.diskStorage({
    //destination for files
    destination: function(req, file, callback) {
        callback(null, './public/uploads/images');
    },

    //add back the extension
    filename: function (req, file, callback){
        callback(null, Date.now()+file.originalname)
    }
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024*1024*3
    },
});

// this route has been transferred to the server. This is done only beacuse of using authenticate moduke in server to get logged in user 
// router.get("/new", (req, res)=>{
//     var user = req.user
//     console.log(user);
//      res.render("new")
// })

//view route
router.get("/:slug", async (req, res)=>{
    let casestudy = await Casestudy.findOne({ slug: req.params.slug });

    if(casestudy){
        res.render("show", { casestudy: casestudy})
    } else {
        res.redirect("/")
    }
});

//route that handles new post
router.post("/casehome.ejs", upload.single("image"), async (req, res)=>{
    //console.log(req.body);
    if(req.file === undefined){
        let casestudy = new Casestudy({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
    });

    try {
        casestudy = await casestudy.save();
        // console.log(casestudy.id);
        res.redirect(`${casestudy.slug}`)
    } catch (error) {
        console.log(error);
    }
    } else {
        let casestudy = new Casestudy({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            img: req.file.filename
        });
    
        try {
            casestudy = await casestudy.save();
            // console.log(casestudy.id);
            res.redirect(`${casestudy.slug}`)
        } catch (error) {
            console.log(error);
        }
    }
    
});




module.exports = router;