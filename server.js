const express = require('express');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corsOptions));

const db = require("./app/models");
const Role = db.role;

/* 
in dev: drop existing tables and re-sync db with force: true
in prod: insert rows manually and use sync() without params to avoid dropping DataTransfer
 */
db.sequelize.sync({ force:true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial(){
    Role.create({
        id: 1,
        name: "User"
    });

    Role.create({
        id: 2,
        name: "moderator"
    });

    Role.create({
        id: 3,
        name: "admin"
    });
}

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route 
app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Galactic Republic"});
});

// routes
require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}.`);
});