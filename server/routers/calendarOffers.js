const router = require('express').Router();
const Offer = require('../models/calendarOffer')
const Provider = require('../models/providers')

router.get('/', async (req, res) => {
    const timeRanges = await Offer.find({});
    res.send(timeRanges);
})

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const timeRange = new Offer({
            monthFrom: body.monthFrom,
            dayFrom: body.dayFrom,
            hoursFrom: body.hoursFrom,
            minutesFrom: body.minutesFrom,
            monthTo: body.monthTo,
            dayTo: body.dayTo,
            hoursTo: body.hoursTo,
            minutesTo: body.minutesTo
        });
        const offered = await timeRange.save();
        res.json(offered);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

router.post('/:providerId', async (req,res) => {
    try {
        const body = req.body;

        const provider = await Provider.findById(req.params.providerId);
        const additionalTimeRange = new Offer({
            yearFrom: body.yearFrom,
            monthFrom: body.monthFrom,
            dayFrom: body.dayFrom,
            hoursFrom: body.hoursFrom,
            minutesFrom: body.minutesFrom,
            yearTo: body.yearTo,
            monthTo: body.monthTo,
            dayTo: body.dayTo,
            hoursTo: body.hoursTo,
            minutesTo: body.minutesTo
        });
        const savedTimerange = await additionalTimeRange.save();

        provider.timeoffer = provider.timeoffer.concat(savedTimerange.id);
        provider.save();
        res.json(savedTimerange);

    } catch (err) {
        console.log("Error: " + err.message);
    }
})


router.delete('/:id/timeoffer/:timeId', async (req, res) => {
    try {
        await Provider.findOneAndUpdate(
            { _id: req.params.id },
            { $pull: { timeoffer: req.params.timeId } }
        )
        await Offer.findByIdAndDelete(req.params.timeId)

        res.status(204).end()
    } catch (err) {
        console.log('Error:', err)
    }
})

router.put('/:id', async (req, res) => {
    const body = req.body
    //const params = req.params;

    try {
        const updated = await Offer.findByIdAndUpdate(
            req.params.id, body, { new: true }
        )

        res.status(200).json(updated.toJSON())
    } catch (err) {
        console.log('Error: ', err)
    }
})

module.exports = router;