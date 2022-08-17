//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const multer = require("multer")
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken')
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const casestudyRouter = require("./routes/casestudies");
const Casestudy = require("./models/Casestudy");
const { json } = require('express');

const app = express();

app.use(express.json())
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))

app.use(session({
  secret: process.env.RESETSECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


//connect to mongoose
mongoose.connect("mongodb+srv://repairhint:12345@cluster0.muhuotz.mongodb.net/repairhint", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.plugin(slug);
const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  //username is used because it will be stored in the database as username bacauuse passport-local is handling auth
  username: String,
  membername: { type: String, unique: true },

  slug: {
    type: String,
    slug: "membername",
    unique: true,
    slug_padding_size: 3
  },
  password: String,
  refered: {
    type: Number,
    default: 0
  },
  referrerSlug: { type: String, default: '' },
  logins: { type: Number, default: 1 },
  return: { type: Number, default: 0 },
  sub: { type: Number, default: 0 }

});

const clueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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


//Schema for no picture quiz
const quizQuestionSchema = new mongoose.Schema({
  category: String,
  q: String,
  options: Array,
  opts: String,
  answer: Number,
})

//Schema for picture quiz
const picturequizQuestionSchema = new mongoose.Schema({
  category: String,
  q: String,
  options: Array,
  opts: String,
  answer: Number,
  img: {
    type: String,
    default: "placeholder.jpg"
  },
})

const JWT_SECRET = 'some super secret...'

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

//define storage for the images
const storage = multer.diskStorage({
  //destination for files
  destination: function (req, file, callback) {
    callback(null, './public/uploads/clue-images');
  },

  //add back the extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname)
  }
});



//upload parameters for multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 3
  },
});


// app.get("/new", (req, res)=>{
//    res.render("new")

// })


userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*
below is the source for for the code example
https://www.geeksforgeeks.org/mongoose-findone-function/?ref=lbp
*/
async function sub() {
  let users = await mongoose.model("user", userSchema).find()

  users.forEach(user => {

    var currentUserId = user.id
    var referrerSlug = user.referrerSlug
    //this is the method used to decrease current user sub *findById function* 
    User.findById(currentUserId, function (err, docs) {
      if (err) {
        console.log(err);
      }
      else {
        var check = docs.sub
        if (check <= 0) {
          console.log("current user " + user.slug + " sub is 0");
        } else {
          User.findOneAndUpdate({ _id: currentUserId }, { $inc: { sub: -1 } }, { new: true }, function (err) {
            if (err) {
              console.log(err);
            } else {
              //this is used to add 1 to referrer bonus  *findAndUpdate functuion*       
              User.findOneAndUpdate({ slug: referrerSlug }, { $inc: { return: 1 } }, { new: true }, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log("curent user sub reduced by 1 and 1 is added to refer return");
                }
              })
            }
          })
        }
      }
    });
  }
  )
}
sub()

//setInterval(sub, 5000)


// response to get request for home page
app.get("/", function (req, res) {

  if (!req.isAuthenticated()) {
    var check = 1   //used to differentiate weather the is login on home page or not in other to manipulate login and logout button
    var home = "<a class='nav-link btn-1' href='/'>Home</a>"
    var repair = "<a class='nav-link btn-2' href=''>Repair Navigator</a>"
    var random = "<a class='nav-link btn-3' href=''>Random secret/clue</a>"
    var study = "<a class='nav-link btn-4' href=''>Case studies</a>"
    var quiz = "<a class='nav-link btn-5' href=''>Quiz</a>"
    var about = "<a class='nav-link' href='../partial/about-us-home.ejs'>About us</a>"
    var account = ""
    var script = "js/index2.js"

    res.render("index", {
      check: check,
      home: home,
      repair: repair,
      random: random,
      study: study,
      about: about,
      quiz: quiz,
      script: script,
      account: account
    })
  } else {
    var check = 2   //used to differentiate weather the is login on home page or not in other to manipulate login and logout button
    var home = "<a class='nav-link' href='/'>Home</a>"
    var repair = "<a class='nav-link' href='../partials/repair-navigator.ejs'>Repair Navigator</a>"
    var random = "<a class='nav-link' href='../partials/random-secret.ejs'>Random secret/clue</a>"
    var study = "<a class='nav-link' href='/casehome.ejs'>Case studies</a>"
    var quiz = "<a class='nav-link' href='../partials/quizchoice.ejs'>Quiz</a>"
    var about = "<a class='nav-link' href='../partial/about-us.ejs'>About us</a>"
    var account = "<a class='nav-link' href='../account.ejs'>My account</a>"
    var script = "" //used to remove script so that navbar content is clickable

    res.render("referer", {
      check: check,
      home: home,
      repair: repair,
      random: random,
      study: study,
      quiz: quiz,
      about: about,
      script: script,
      account: account
    })
  }

});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.get('/account.ejs', function (req, res) {
  if (req.isAuthenticated()) {
    var user = req.user
    var firstLeter = user.first.slice(0, 1)
    var firstComplete = firstLeter.toUpperCase()
    var firstLower = user.first.slice(1, 15)
    var firstRemainder = firstLower.toLowerCase()
    var first = firstComplete + firstRemainder

    var lastLeter = user.last.slice(0, 1)
    var lastComplete = lastLeter.toUpperCase()
    var lastLower = user.last.slice(1, 15)
    var lastRemainder = lastLower.toLowerCase()
    var last = lastComplete + lastRemainder

    var fullname = first + " " + last
    var refer = user.refered
    var login = user.logins
    var id = user.slug
    var returns = user.return
    var sub = user.sub
    var username = user.username
    var userId = "localhost:3000/" + id

    if (user.username === "repairhint@gmail.com") {
      var boss = "Admin"
    } else {
      var boss = "client-box"
    }

    res.render('user-account', {
      first: first,
      fullname: fullname,
      refer: refer,
      login: login,
      userId: userId,
      boss: boss,
      sub: sub,
      username: username,
      returns: returns
    });
  } else {
    res.redirect('/');
  }
})

//////////////////////////////fails to work if i place this route after this place
app.get("/casehome.ejs", async function (req, res) {
  let casestudies = await Casestudy.find().sort({ timeCreated: 'desc' })

  res.render("casehome", { casestudies: casestudies })
});


app.get("/:slug", (req, res) => {
  if (!req.isAuthenticated()) {
    var check = 1   //used to differentiate weather the is login on home page or not in other to manipulate login and logout button
    var home = "<a class='nav-link btn-1' href=''>Home</a>"
    var repair = "<a class='nav-link btn-2' href=''>Repair Navigator</a>"
    var random = "<a class='nav-link btn-3' href=''>Random secret/clue</a>"
    var study = "<a class='nav-link btn-4' href=''>Case studies</a>"
    var quiz = "<a class='nav-link btn-5' href=''>Quiz</a>"
    var about = "<a class='nav-link' href='../partial/about-us-home.ejs'>About us</a>"
    var account = ""
    var script = "js/index2.js"

    res.render("index", {
      check: check,
      home: home,
      repair: repair,
      random: random,
      study: study,
      quiz: quiz,
      about: about,
      script: script,
      account: account
    })
  } else {
    var check = 2   //used to differentiate weather the is login on home page or not in other to manipulate login and logout button
    var home = "<a class='nav-link' href='/'>Home</a>"
    var repair = "<a class='nav-link' href='../partials/repair-navigator.ejs'>Repair Navigator</a>"
    var random = "<a class='nav-link' href='../partials/random-secret.ejs'>Random secret/clue</a>"
    var study = "<a class='nav-link' href='/casehome.ejs'>Case studies</a>"
    var quiz = "<a class='nav-link' href='../partials/quizchoice.ejs'>Quiz</a>"
    var about = "<a class='nav-link' href='../partial/about-us.ejs'>About us</a>"
    var account = "<a class='nav-link' href='../account.ejs'>Account</a>"
    var script = "" //used to remove script so that navnbar content is clickable

    res.render("referer", {
      check: check,
      home: home,
      repair: repair,
      random: random,
      study: study,
      quiz: quiz,
      about: about,
      account: account,
      script: script,
    })
  }
})

//form for handling registration
app.post('/', async (req, res) => {
  //used to get url from index
  var url = req.body.url
  var homeStriped = url.slice(22, 50)
  var referId = "" + homeStriped
  console.log(referId);
  if (url.length > 22) {
    //used to register new user if its comming through referer
    User.register({ first: req.body.first, last: req.body.last, username: req.body.username, referrerSlug: referId }, req.body.password, function (err, user) {
      if (err) {
        res.send('<h1>A user with the given username is already registered</h1>');
        //res.render('static/error/user-exist');
      } else {
        //Used to get and increase refer value by 1 if there is referer link    
        User.findOneAndUpdate({ slug: referId }, { $inc: { refered: 1 } }, { new: true }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("successfully register new user with referer");
          }
        })
        passport.authenticate('local')(req, res, function () {
          // console.log(user.id);
          res.redirect(`${user.slug}`)
        });
      }
    });
  } else {
    //used to register user when there is no referer link
    let search = await User.findOne({ membername: req.body.membername })
    if (search) {
      res.render('static/error/user-exist', { search: search });
    } else {
      User.register({ first: req.body.first, last: req.body.last, membername: req.body.membername, username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
          res.render('static/error/user-exist', { search: search });
        } else {
          passport.authenticate('local')(req, res, function () {
            // console.log(user.id);
            res.redirect(`${user.slug}`)
          });
        }
      });
    }
  }
});

app.post('/login', function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function () {
        //used to monitor  user login  
        var user = req.user.username
        User.findOneAndUpdate({ username: user }, { $inc: { logins: 1 } }, { new: true }, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("login is successful");
          }
        })
        res.redirect('/');
      });
    }
  });
});

//without this route, login is not working
app.get('/login', function (req, res) {
  res.render('')
});



//response to get request for content in partials folder
app.get("/partials/repair-navigator.ejs", function (req, res) {
  res.render("static/repair-navigator");
});

app.get("/partials/random-secret.ejs", async function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    //used to find all the content in clue collection in database 
    let clues = await mongoose.model("clue", clueSchema).find().sort({ title: 'desc' })

    //used to randomly select one out of the result from clue collection
    var randomSelectOne = Math.floor(Math.random() * clues.length)
    carouselActive = clues[randomSelectOne]
    res.render("static/random-secret", { clues: clues, carouselActive: carouselActive })

  } else {
    res.redirect('/');
  }
});

//route that shows review for admin after posting clue 
app.get("/adminclue/:slug", async function (req, res) {
  let clue = await mongoose.model("clue", clueSchema).findOne({ slug: req.params.slug });

  if (clue) {
    res.render("adminshow", { clue: clue })
  } else {
    res.redirect('/')
  }
})

app.post("/partials/random-secret.ejs", upload.single("image"), async function (req, res) {
  // console.log(req.body);
  if (req.file === undefined) {
    let clue = new mongoose.model("clue", clueSchema)({
      title: req.body.title,
      description: req.body.description,
      // img: req.file.filename
    });
    try {
      clue = await clue.save()

      res.redirect(`/adminclue/${clue.slug}`)
    } catch (error) {
      console.log(error);
    }
  } else {
    let clue = new mongoose.model("clue", clueSchema)({
      title: req.body.title,
      description: req.body.description,
      img: req.file.filename
    });
    try {
      clue = await clue.save()

      res.redirect(`/adminclue/${clue.slug}`)
    } catch (error) {
      console.log(error);
    }
  }

})


app.get("/partials/quizchoice.ejs", function (req, res) {
  res.render("static/quizchoice")
});

app.get("/partial/about-us-home.ejs", function (req, res) {

  var check = 1   //used to differentiate weather the is login on home page or not in other to manipulate login and logout button
  var home = "<a class='nav-link btn-1' href=''>Home</a>"
  var repair = "<a class='nav-link btn-2' href=''>Repair Navigator</a>"
  var random = "<a class='nav-link btn-3' href=''>Random secret/clue</a>"
  var study = "<a class='nav-link btn-4' href=''>Case studies</a>"
  var quiz = "<a class='nav-link btn-5' href=''>Quiz</a>"
  var about = "<a class='nav-link' href='../partial/about-us-home.ejs'>About us</a>"
  var account = ""

  res.render("static/about-us-home", {
    check: check,
    home: home,
    repair: repair,
    random: random,
    study: study,
    about: about,
    quiz: quiz,
    account: account
  })
});

app.get("/casehome.ejs", async function (req, res) {
  let casestudies = await Casestudy.find().sort({ timeCreated: 'desc' })

  res.render("casehome", { casestudies: casestudies })
});

app.get("/partial/about-us.ejs", function (req, res) {
  res.render("static/about-us")
});

app.get("/partials/no-picture-quiz.ejs", async function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    let quizs = await mongoose.model("quiz", quizQuestionSchema).find().sort({ q: 'desc' })

    // console.log(quizs[0].options);
    res.render("static/no-picture-quiz", { quizs: quizs })
  } else {
    res.redirect('/');
  }
});

app.post("/partials/no-picture-quiz.ejs", async function (req, res) {
  const Quiz = new mongoose.model("Quiz", quizQuestionSchema)
  let quiz = new Quiz({
    category: req.body.category,
    q: req.body.q,
    options: [req.body.optionOne, req.body.optionTwo, req.body.optionThree],
    answer: req.body.answer,
  })

  try {
    quiz = await quiz.save();
    res.redirect(`/quizpost/${quiz.id}`);
  } catch (error) {
    console.log(error)
  }
})
//used to show review of posted quiz for no picture quiz
app.get("/quizpost/:id", async function (req, res) {
  let quiz = await mongoose.model("quiz", quizQuestionSchema).findById(req.params.id)
  if (quiz) {
    res.render('static/showquizpost', { quiz: quiz })
  } else {
    res.redirect("static/no-picture-post.ejs")
  }
})

app.get("/partials/no-picture-post.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/no-picture-post.ejs")
  } else {
    res.redirect('/');
  }

})


app.post("/partials/picture-quiz.ejs", upload.single('image'), async function (req, res) {
  const Picturequiz = new mongoose.model("PictureQuiz", picturequizQuestionSchema)
  let quiz = new Picturequiz({
    category: req.body.category,
    q: req.body.q + " <br><img class='imgp' src='/uploads/clue-images/" + req.file.filename + "'" + "/></br>",
    options: [req.body.optionOne, req.body.optionTwo, req.body.optionThree],
    answer: req.body.answer,
    img: req.file.filename
  })
  // console.log(quiz.q);
  // console.log(quiz);
  try {
    quiz = await quiz.save();
    res.redirect(`/picturequizpost/${quiz.id}`);
  } catch (error) {
    console.log(error)
  }
})

//used to show review of posted quiz for picture quiz
app.get("/picturequizpost/:id", async function (req, res) {
  let quiz = await mongoose.model("picturequiz", picturequizQuestionSchema).findById(req.params.id)
  if (quiz) {
    res.render('static/showquizpost', { quiz: quiz })
  } else {
    res.redirect("static/no-picture-post.ejs")
  }
})

app.get("/partials/picture-post.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/picture-post.ejs")
  } else {
    res.redirect('/');
  }
})

app.get("/partials/picture-quiz.ejs", async function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    let quizs = await mongoose.model("picturequiz", picturequizQuestionSchema).find().sort({ q: 'desc' })

    // console.log(quizs[0].options);
    res.render("static/picture-quiz", { quizs: quizs })
  } else {
    res.redirect('/');
  }
});

app.get("/static/sub.ejs", function (req, res) {
    res.render("static/sub.ejs")
})


//moved here from it's original location 
app.get("/casestudies/new", (req, res) => {
  if (req.isAuthenticated() && req.user.sub > 1) {
    var user = req.user.membername
    res.render("new", { user: user })
  } else {
    res.redirect('/');
  }
})


app.get("/static/reset-password/forgot-password", (req, res, next) => {
  res.render("static/password-reset/forgot-password")
})

app.post("/static/reset-password/forget-password", async (req, res, next) => {
  var username = req.body.username
  //used to search user
  let user = await mongoose.model("user", userSchema).findOne({ username: username });

  if (!user) {
    res.send('<h1> User not registered </h1>');
    return;
  }
  //used to create one time link when user exist
  const secret = JWT_SECRET + user.password
  const payload = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(payload, secret, { expiresIn: '15m' })
  const link = `http://localhost:3000/static/reset-password/reset-password/${user.id}/${token}`

  //used to send mail user, using node mailer
  let mailOptions = {
    from: 'yusufibrahimfortech@gmail.com',
    to: user.username,
    subject: 'Repairhint Password Reset',
    text: link
  };


  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log('error occurs', err);
    } else {
      console.log('email successfully sent!!!!');
    }
  })
  console.log(link);
  res.render("static/password-reset/password-link")
})

app.get("/static/reset-password/reset-password/:id/:token", async (req, res, next) => {
  const { id, token } = req.params

  //used to check if this id exist in database
  let user = await mongoose.model("user", userSchema).findById(id);
  console.log(user);
  console.log(id);
  if (id !== user.id) {
    res.send('invalid id...')
    return
  }
  //if id is valid and we have user valid with this id
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token, secret)
    res.render('static/password-reset/reset-password', { username: user.username })
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
})

app.get("/static/reset-password/reset-password", (req, res) => {
  var username = "new"
  res.render("static/password-reset/reset-password", { username: username })
})

app.post("/static/reset-password/reset-password", async (req, res) => {
  // let user = await mongoose.model("user", userSchema).find({username: req.body.username});  
  //console.log(user);
  var password = req.body.password;
  console.log(password);
  User.find({ username: req.body.username }).then(function (sanitizedUser) {
    if (sanitizedUser) {
      sanitizedUser.setPassword(password, function () {
        sanitizedUser.save();
        res.status(200).json({ message: 'password reset successful' });
      });
    } else {
      res.status(500).json({ message: 'This user does not exist' });
    }
  }, function (err) {
    console.error(err);
  })
})

app.post("/static/reset-password/reset-password/:id/:token", async (req, res, next) => {
  const { id, token } = req.params;
  const { password, password2 } = req.body

  //used to check if id exist in database
  let user = await mongoose.model("user", userSchema).findById(id);
  if (id !== user.id) {
    res.send('invalid id...')
    return
  }
  const secret = JWT_SECRET + user.password
  try {
    const payload = jwt.verify(token, secret)
    //validate password and password2 should match
    //used to find user with a payload with an email and id and update with new password
    //dont forget to hash the password
    //user.password = password
    // user is your result from userschema using mongoose id
    user.setPassword(req.body.password, function (err) {
      user.save()
      if (err) {
        console.log(err);
      } else {
        res.redirect('/')
      }
    })
  } catch (error) {
    console.log(error.message);
    res.send(error.message)
  }
})

// response to get request for contents in issue folder
app.get("/partials/issue/clock-32-768khz.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/clock-32-768khz")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/component-heating.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/component-heating")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/dc-dc.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/dc-dc")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ddr1.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ddr1")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ddr2.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ddr2")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ddr3.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ddr3")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ddr4.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ddr4")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ex-disp-no-int-disp.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ex-disp-no-int-disp")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/fan-not-spinning.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/fan-not-spinning")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/io-requirements.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/io-requirements")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/late-display.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/late-display")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/lvds.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/lvds")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/mb-issue.ejs", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("static/issue/mb-issue")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/me-region-shutdown.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/me-region-shutdown")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-19v-at-clr.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-19v-at-clr")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-aux-voltage.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-aux-voltage")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-cpu-core.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-cpu-core")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-display.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-display")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-lvds-with-battery.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-lvds-with-battery")
  } else {
    res.redirect('/');
  }

});

app.get("/partials/issue/no-pch-ich-voltage.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-pch-ich-voltage")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/white-screen.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/white-screen")
  } else {
    res.redirect('/');
  }
})

app.get("/partials/issue/screen-flickering.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/screen-flickering")
  } else {
    res.redirect('/');
  }

})

app.get("/partials/issue/flickering-display.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/flickering-display")
  } else {
    res.redirect('/');
  }
})

app.get("/partials/issue/flickering-with-battery.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/flickering-with-battery")
  } else {
    res.redirect('/');
  }
})

app.get("/partials/issue/no-pwr.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-pwr")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/no-ram-voltage.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/no-ram-voltage")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/not-charging-19v.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/not-charging-19v")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/not-charging.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/not-charging")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/one-restart.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/one-restart")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/psid.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/psid")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/pwr-with-adapter.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/pwr-with-adapter")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/pwr-with-battery.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/pwr-with-battery")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/ram-requirement.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/ram-requirement")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/restarting.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/restarting")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/RTC-section.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/RTC-section")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/short-in-dc-dc.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/short-in-dc-dc")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/short-in-pwm-coil.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/short-in-pwm-coil")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/short-on-19v-rail.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/short-on-19v-rail")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/short.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/short")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/stable-without-ram.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/stable-without-ram")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/standby-section.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/standby-section")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/stock-at-logo.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/stock-at-logo")
  } else {
    res.redirect('/');
  }
});

app.get("/partials/issue/token-capacitor.ejs", function (req, res) {
  if (req.isAuthenticated() && req.user.sub > 1) {
    res.render("static/issue/token-capacitor")
  } else {
    res.redirect('/');
  }
});


app.use("/casestudies", casestudyRouter);

app.listen(3000, () => {
  console.log("This server app listening on port 3000")
})
