const historyRouter = require('express').Router();
const pHistory = require('../models/pro_history');

historyRouter.get('/', async (req, res) => {
    const proHistory = await pHistory.find({}).populate('user');
    res.send(proHistory);
});
historyRouter.post('/', async (req, res) => {
    const body = req.body;
    try {
        const proHistoryData = new pHistory({
            header: body.header,
            address: body.address,
            date: body.date,
            user: body.userID
        })
        await proHistoryData.save();
        res.status(200).send(proHistoryData);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

module.exports = historyRouter;