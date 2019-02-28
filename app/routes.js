var mongojs = require("mongojs");
var db = mongojs("mongodb://127.0.0.1/mongotask", ["auth1"]);
module.exports = function(app, passport){

      app.post("/login", function(req, res, next) {
          var data = req.body;

          db.auth1.save(data, function(err, task) {
              if (err) {
                  res.send(err);
              }
              res.json(task);
          });
     });
    app.get('/', function(req, res){
        res.render('index.ejs');
    });

    app.get('/login', function(req, res){
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
      app.post('/login', passport.authenticate('local-login', {
          successRedirect: 'http://localhost:3000',
          failureRedirect: '/login',
         failureFlash: true
      }));

    // app.get('/signup', function(req, res){
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    // app.get('/profile', isLoggedIn, function(req, res){
    //     res.render('profile.ejs', { user: req.user });
    // });

    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { successRedirect: '/profile',
            failureRedirect: '/' }));


    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })
};

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}