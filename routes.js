const router = require('express').Router();

router.post('/book-ticket', function(req, res, next) {
  if(!req.body.movie.name){
    return res.status(422).json({errors: {name: "can't be blank"}});
  }

  if(!req.body.movie.time){
    return res.status(422).json({errors: {time: "can't be blank"}});
  }

  // Here you'd expect the ticket booking to occur, but this is an example service, so...

  return res.status(200).json({ticketBooked: true});
});

module.exports = router;