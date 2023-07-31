const router = require('express').Router();
const shortUrl = require('../models/shortUrl');

const authCheck = function(req,res,next){
    if(!req.user){
        res.redirect('/auth/login')
    }else{
        next();
    }
}

router.get('/search',authCheck, async function(req,res){
    try {
        const shortUrls = await shortUrl.find({ email : req.user.email });
        res.render('search', { results : shortUrls , user : req.user });
      } catch (error) {
        console.error('Error retrieving short URLs:', error);
        res.status(500).send('Error retrieving short URLs');
      }
});

router.get('/dashboard',authCheck,async function(req,res){
    try {
        const shortUrls = await shortUrl.find({ email : req.user.email });
        res.render('dashboard', { shortUrls : shortUrls , user : req.user });
      } catch (error) {
        console.error('Error retrieving short URLs:', error);
        res.status(500).send('Error retrieving short URLs');
      }
    // res.send(req.user);
})

router.get('/delete/:del',authCheck,async function(req,res){
        const del = req.params.del;
  
      // Find and delete the entry with the matching short URL
      await shortUrl.findOneAndDelete({ short: del });
  
      res.redirect('/access/dashboard');
})

router.get('/linkto/:sho', async (req, res) => {
    const short = await shortUrl.findOne({ short: req.params.sho })
    if (short == null) return res.sendStatus(404)
  
    short.clicks++;
    short.save();
  
    res.redirect(short.full)
  })

router.post('/search',authCheck,async function(req,res){
    try {
        const shortUrls = await shortUrl.find({ email : req.user.email , title: { $regex: req.body.title, $options: 'i' } });
        res.render('search', { results : shortUrls , user : req.user });
      } catch (error) {
        console.error('Error retrieving short URLs:', error);
        res.status(500).send('Error retrieving short URLs');
      }
});

router.post('/save',authCheck,async function(req,res){
    try {
        const existingUrl = await shortUrl.findOne({ full: req.body.fullUrl });
    
        if (existingUrl) {
          // If the URL already exists, redirect to the home route
          res.redirect('/access/dashboard');
        } else {
          // If the URL doesn't exist, create a new entry
          const newUrl = await shortUrl.create({ full: req.body.fullUrl , title : req.body.title , email : req.user.email });
          res.redirect('/access/dashboard');
        }
      } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).send('Error creating short URL');
      }
})

router.post('/savee',async function(req,res){
    try {
        const existingUrl = await shortUrl.findOne({ full: req.body.fullUrl });
    
        if (existingUrl) {
          // If the URL already exists, redirect to the home route
          res.redirect('/');
        } else {
          // If the URL doesn't exist, create a new entry
          const newUrl = await shortUrl.create({ full: req.body.fullUrl , title : req.body.title});
          res.redirect('/');
        }
      } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).send('Error creating short URL');
      }
})

module.exports = router;