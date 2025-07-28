const router = require('express').Router();
const key = require('../utils/config')

router.get('/', async (reg, res) => {
    const googleKey = key.GOOGLE_MAP
    res.send(googleKey)
})

router.get('/distance', async (req, res) => {
    res.json()
})

module.exports = router