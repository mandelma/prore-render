const router = require('express').Router();
const BookingTime = require('../models/calendarBooking')
const Recipient = require('../models/recipients')

router.get('/', async (req, res) => {
    const bookings = await BookingTime.find({});

    res.send(bookings);
})

router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const bookingTime = new BookingTime({
            booking: {
                month: body.month,
                day: body.day,
                hours: body.hours,
                minutes: body.minutes
            }
        })


        const booked = await bookingTime.save()
        res.json(booked)
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

router.post('/:recipientId', async (req, res) => {
    try {
        const body = req.body;
        console.log("Recipient id: " + req.params.recipientId);
        const recipient = await Recipient.findById(req.params.recipientId);
        const bookingTime = new BookingTime({
            booking: {
                month: body.month,
                day: body.day,
                hours: body.hours,
                minutes: body.minutes
            }
        })


        const booked = await bookingTime.save()
        recipient.booking = recipient.booking.concat(booked.id);
        recipient.save();
        res.json(booked)
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

module.exports = router;