const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const requireAuth = require('../middlewares/requireAuth')

const router = express.Router();

router.post('/signup', async (req, res) => {
   const { userName, email, password, contact } = req.body;
   

   try{
    const user = new User({ userName, email, password, contact });
    await user.save();
 
    const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
     res.send({ token });
   }catch(err){
    return res.status(422).send(err.message);   
   }
   
});
router.post('/signin', async (req, res) => {
   const {  email, password } = req.body;

   if(!email || !password){
      return res.status(422).send({ error: 'must provide emeil and password'});
   }
   const user = await User.findOne({ email });
   
    if(!user) {
       return res.status(422).send({ error: 'invalid password or email' });
    }
    try{
       await user.comparePassword(password);
       const token = jwt.sign({ userId: user._id}, 'MY_SECRET_KEY');
       
       res.send({ token, userId: user._id, email: user.email, userName: user.userName });
      
    }catch(err){
        return res.status(422).send({ error: 'invalid password or email' });
    }

});
router.get('/profile', async(req, res, next) => {
   const { authorization } = req.headers;
   if(!authorization){
      return res.status(401).send({ error: 'you must be logged in.'});
  }
  const token = authorization.replace( 'Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
      if(err){
          return res.status(401).send({ error: 'you must be logged in.'});
      }
      const { userId } = payload;
 
      const user = await User.findById(userId);
      req.user = user;
      res.send(user)
      next();
  });
 });
  




module.exports = router;
