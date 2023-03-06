const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { session } = require("passport");
const config = require("../config/database");
const passport = require("passport");

const User = require("../models/user");
const Result = require("../models/result");

// Register
router.post("/register", (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: "failed to add a user" });
    } else {
      res.json({ success: true, msg: "user added successfully" });
    }
  });
});

// Authentication
router.post("/authentication", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "user not found" });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secretKey, {
          expiresIn: 604800, //1 week
        });

        res.json({
          success: true,
          token: "Bearer " + token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
          },
        });
      } else {
        res.json({ success: false, msg: "Password doesn't match" });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.headers.authorization);
    res.json({ user: req.user });
  }
);

//registerTheResult
router.post("/postResult", (req, res) => {
  console.log(req.body);
  let data = req.body;

  let newResult = new Result({
    event: data.event,
    name: data.name,
    college: data.college,
    mark: data.mark,
    position: data.position,
  });

  newResult.save((err, result) => {
    if (err) {
      res.json({ success: false, msg: "some error occur" });
    } else {
      res.json({ success: true, msg: "result added successfully" });
    }
  });
});
//getOneResult
router.post("/oneResult", (req, res) => {
  console.log(req.body);
  let event = req.body.event;

  Result.find({ event: event }, (err, result) => {
    if (err) {
      res.json({ success: false, msg: "some error occur" });
    } else {
      res.json({ success: true, result });
    }
  });
});
//overall
router.post("/postResult", (req, res) => {
  console.log(req.body);
  let data = req.body;

  let newResult = new Result({
    event: data.event,
    name: data.name,
    college: data.college,
    mark: data.mark,
    position: data.position,
  });

  newResult.save((err, result) => {
    if (err) {
      res.json({ success: false, msg: "some error occur" });
      console.log(err)
    } else {
      res.json({ success: true, msg: "result added successfully" });
    }
  });
});
//getOneResult
router.get("/overall", async (req, res) => {
  let result = await Result.aggregate(
    [{ $group: { _id: "$college", totalPoints: { $sum: "$mark" } } }],
    (err, data) => {
      if (err) {
        res.json({ success: false, msg: "some error occur" });
      } else {
        res.json({ success: true, data });
      }
    }
  );
});

// delete Result
router.post("/deleteResult",(req,res)=>{
  let id=req.body.id
  Result.deleteOne({_id:id},(err,result)=>{
    if (err) {
      res.json({ success: false, msg: "some error occur" });
      
    } else { 
      res.json({ success: true, msg:'deleted successfully',result:result }); 
      
    }
  })
})

router.get('/getAllResult',(req,res)=>{
  Result.find((err,data)=>{
    if (err) {
      res.json({ success: false, msg: "some error occur" });
      
    } else { 
      res.json({ success: true, data:data}); 
      
    }
  })
})

module.exports = router;
