const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res) => {
    res.render("../views/users/signup.ejs");
};

module.exports.signup = async (req,res) => {
    try{
         let {username, email, password} = req.body;
       const newUser = new User({email,username});
       const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                next(err);
            }
            req.flash("success", "Registered Successfully, Welcome to wanderLust");
            res.redirect(res.locals.redirectUrl);
        });
       

    }  catch(e){
            req.flash("error", e.message);
            res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("C:\\Users\\aryag\\MAJORPROJECT\\views\\users\\login.ejs");
};

module.exports.login =async(req,res) => {
                req.flash("success","Welcome! to wanderLust, You're logged in.");
                let redirectUrl = res.locals.redirectUrl || "/listings"
                res.redirect(redirectUrl) ;
};

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
          return  next(err);
        }
        req.flash("success", "You're logged out now!");
        res.redirect("/listings");
    });
};
