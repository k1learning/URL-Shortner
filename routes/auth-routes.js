const passport = require('passport');
const router = require('express').Router();

//auth login
router.get('/login',function(req,res){
    res.render('login');
});

//auth logout
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
})

//auth with google
router.get('/google',passport.authenticate('google',{
    scope : ['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),function(req,res){
    res.redirect('/access/dashboard');
    // res.send(req.user);
});

module.exports = router;