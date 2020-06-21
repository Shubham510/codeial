const User = require('../models/user')

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('user',{
            title : "User Profile",
            profile_user: user
        });
    })
    
}

module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body, function(err,user){
            return res.redirect('back');
        })
    }else{
        return res.status(401).send('Unauthorized');
    }
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: " Todo | Sign Up"
    })
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: " Todo | Sign In"
    })
}


// get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err,user){
        if(err){console.log('Error in finding user in signing up'); return}

        if(!user){
            User.create(req.body, function(err,user){
                if(err){console.log('Error in finding user in signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            res.redirect('back');
        }
    })
}

// sign in and create a session
module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function (req,res){
    req.logout();
    
    return res.redirect('/');
}