const isLogin = async(req,res,next)=>{
    try{
        if(req.session.User_id){}
        else{
            res.redirect('/sign-in');
        }
        next();
    }
    catch (error) {
        console.log(error.messege);
    }
}

const isLogout = async(req,res,next)=>{
    try{
        if(req.session.User_id){
            res.redirect('/profile');
        }
        
        next();
    }
    catch (error) {
        console.log(error.messege);
    }
}

module.exports = {
    isLogin,
    isLogout
}