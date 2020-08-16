const express = require('express');
if (process.env.NODE_DEV !== 'production'){
    require('dotenv').config();
}
const cookies = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(cookies());
app.use(session({
    secret: 'secret_bleh',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());

app.get('/', (req,res) => {
    res.status(200).json({
        message: 'Welcome!'
    })
})

app.get('/api', (req,res) => {
    res.status(200).json({
        name: 'Judd Misael Baguio',
        gf: 'Keith Yvonne C. Saycon'
    })
})

app.post('/api/posts', verifyToken, (req,res) => {
    jwt.verify(req.token, 'blablabla', (err, authdata) => {
        if(err) {
            res.status(403).json({message: 'Error'})
        } else {
            res.status(200).json({
                message: 'Post created.',
                data: authdata,
                time: Date.now()
            })
        }
    })
}) // Protect this route

app.post('/api/login', (req,res) => {
    const user = {
        id: 1,
        username: 'juddbaguio',
        email: 'juddmisaelbaguio@gmail.com'
    }

    jwt.sign({user}, 'blablabla', (err, token) => {
        res.status(200).json({token})
    })
})

// Format of Token
// Authorization: Bearer <access_token>

// verify token
function verifyToken(req,res,next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization']; // Client-side -> Authorization key
    //Check if authorization header is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split the string value [Bearer, access_token]
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Continue
        next();
    }else {
        // The access is forbidden.
        console.log(req)
        res.status(403).json({
            message: 'Access Denied',
        })
    }
}

app.listen(3000, () => {
    console.log('Connected!')
})
