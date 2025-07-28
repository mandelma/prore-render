const historyRouter = require('express').Router();
const cHistory = require('../models/client_history');


historyRouter.get('/', async (req, res) => {
    const clientHistory = await cHistory.find({}).populate('user');
    res.send(clientHistory);
});
historyRouter.post('/', async (req, res) => {
    const body = req.body;
    try {
        const clientHistoryData = new cHistory({
            status: body.status,
            header: body.header,
            proID: body.proID,
            company: body.company,
            id_number: body.id_number,
            rating: body.rating,
            address: body.address,
            date: body.date,
            professional: body.professional,
            user: body.userID
        })
        console.log("xxxxxx " + body.company);
        await clientHistoryData.save();
        res.status(200).send(clientHistoryData);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})
// Update status
historyRouter.put('/:id', async (req, res) => {
    const body = req.body
    const params = req.params;

    try {
        const updated = await cHistory.findByIdAndUpdate(
            params.id, body, { new: true }
        )

        res.status(200).json(updated.toJSON())
    } catch (err) {
        console.log('Error: ', err)
    }
})

// Update rating
historyRouter.put('/:id/update_rating', async (req, res) => {
    const body = req.body
    const params = req.params;

    try {
        const updated = await cHistory.findByIdAndUpdate(
            params.id, body, { new: true }
        )

        res.status(200).json(updated.toJSON())
    } catch (err) {
        console.log('Error: ', err.message);
    }
})


module.exports = historyRouter;