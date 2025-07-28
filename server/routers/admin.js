const Router = require('express').Router();
const Admin = require('../models/admin')

Router.get('/', async (req, res) => {
    try {
        const completed = await Admin.find({});
        console.log("Completed " + completed)
        res.send(completed);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

module.exports = Router;