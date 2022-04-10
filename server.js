const express = require('express');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const dotenv = require("dotenv");

dotenv.config();

const userService = require("./user-service.js");

const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

/* TODO Add Your Routes Here */

userService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});

app.post('/api/user/register', (req, res)=>{ 
    userService.registerUser(req.body).then(result => res.send(result)).catch(error => res.send(error));
});

app.post('/api/user/login', (req, res)=>{ 
    userService.checkUser(req.body).then(user => jwt.sign({ _id: user._id, userName: user.userName}, process.env.JWT_SECRET))
        .then(result => res.send({message: "login successful", token: result })).catch(error => res.status(422).send(error));
});

app.get('/api/user/favourites', passport.authenticate('jwt', {session: false}),(req, res)=>{
    userService.getFavourites(req.user._id).then(result => res.send(result)).catch(error => res.send(error));
});

app.put('/api/user/favourites/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    userService.addFavourite(req.user._id, req.params.id).then(result => res.send(result)).catch(error => res.send(error));
});

app.delete('/api/user/favourites/:id', passport.authenticate('jwt', {session: false}), (req, res)=>{
    userService.removeFavourite(req.user._id, req.params.id).then(result => res.send(result)).catch(error => res.send(error));
});