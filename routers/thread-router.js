const router = require("express").Router();
const thread = require('../Models/thread-model')

router.get('/thread', (req, res) => {
    thread.findById()
    .then(message => {
        res.status(200).json(message)
        console.log(message)
    })
    .catch(err => res.json({message: "no lins"}))

})
module.exports = router;