const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator"); 
const domPurifier = require("dompurify");
const {JSDOM} = require("jsdom");
const htmlPurify = domPurifier(new JSDOM().window);

const stripHtml = require('string-strip-html');

//initalize slug
mongoose.plugin(slug);
const casestudySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String    
    },
    timeCreated: {
        type: Date,
        default: ()=>Date.now()
    },
    snippet: {
        type: String
    },
    img: {
        type: String,
        default: "placeholder.jpg"
    },
    slug: {
        type: String,
        slug: "title",
        unique: true,
        slug_padding_size: 2
    }
});

casestudySchema.pre('validate', function(next){
    //check if there is a descripton
    if(this.description) {
        this.description = htmlPurify.sanitize(this.description)
        this.snippet = stripHtml(this.description.substring(0,100)).result
    }

     next();
})

module.exports = mongoose.model("Casestudy", casestudySchema);