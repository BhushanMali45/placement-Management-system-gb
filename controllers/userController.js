const User = require("../models/user");
const bcrypt = require ('bcrypt');
const nodemailer = require ('nodemailer');


const securepassword = async(password)=>{
  try {
   const passwordHash = await bcrypt.hash(password,5);
   return passwordHash;
  } catch (error) {
    console.log(error.message)
  }
}
// load home 
module.exports.loadHome = (req, res) => {
 
    return res.render("home");
};

// load profile
module.exports.profile = async(req, res) =>{
  try {
    const userData = await User.findById({_id:req.session.User_id});
    if(userData.usertype==='college'){
      res.render('college_profile',{user:userData});




     




    }
    else if(userData.usertype==='student'){
      res.render('student_profile',{user:userData});


     


    }
    else if(userData.usertype==='company'){
      res.render('company_profile',{user:userData});



    }
   
   

}
catch (error) {
    console.log(error.message);
} 
// if(userData){
//   sendPasswordMail(userData.email,userData.username,req.body.password,userData.usertype)
//  }

};



const sendPasswordMail = async(email,username,password,usertype)=>{
  try {
      
    const transporter = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
          user:'18minorproject@gmail.com',
          pass:'autxqqhdevrkadaa',
      }
     });

     const mailOptions = {
      from:'18minorproject@gmail.com',
      to:email,
      subject:'addmin add new user ',
      html:'<P>Hello '+username+', Admin added you as new user in placement portal.Your credintials are<br><br><b>Email:</b>'+email+'<br><b>Password:</b>'+password+'<br><br>Now, You can signin using this credentials on placement portal as '+usertype+'.</p>'
     }
     transporter.sendMail(mailOptions, function(error,info){
      if(error){
          console.log(error);
      }
      else{
          console.log("Email has been sent:- ",info.response);
      }
     })

  }catch (error) {
      console.log(error.message);   
  }
};

// update password
module.exports.updatePW = async function (req, res) {
 try {
  const User_id = req.session.User_id;
  const username = req.body.username
  const password = req.body.password;

  const data = await User.findOne({_id:User_id});

  if (data) {
    const newPassword = await securepassword(password);
   const userData = await User.findByIdAndUpdate({_id:User_id},{$set:{
      password:newPassword,
      username:username
    }});

    res.redirect('/profile');
  } else {
    res.redirect('/profile');
  }
  
 } catch (error) {
  console.log(error.message);
 }
};
// render the Sign In page
module.exports.signIn = (req, res) => {
 
    return res.render("signin");

};


module.exports.createSession = async(req, res) => {

  try{
    const email = req.body.email;
    const password = req.body.password;


const userData =  await User.findOne({email:email});

if(userData){
   const passwordMatch = await bcrypt.compare(password,userData.password);

   if(passwordMatch){




                    if(userData.usertype ==='college'){


                        req.session.User_id = userData._id;
                        res.redirect('/dashboard');

                    }
                    else if (userData.usertype ==='student'){
                        req.session.User_id = userData._id;
                        res.redirect('student/add-student');
                    }
                    else if (userData.usertype ==='company'){
                        req.session.User_id = userData._id;
                        res.redirect('interview/add-interview');
                    }
                    
                   
                 }

   else{
    res.render('signin',{message:"Email and password is incorrect"})
   }
}
else{
    res.render('signin',{message:"Email and password is incorrect"})
}

}
catch(error){
    console.log(error.message);
}
};


// render the add user page
module.exports.addUser = (req, res) => {
  
    return res.render("addUser");

};

// creating up a new user
module.exports.create = async (req, res) => {
  try {
    const username = req.body.username;
    const usertype = req.body.usertype;
    const mob = req.body.mob
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;

    if (password != confirm_password) {
      return res.redirect("back");
    }
    
     const spassword = await securepassword(req.body.password)
    const users = new User({
      username:username,
      email:email,
      mob:mob,
      password:spassword,
      usertype:usertype
     });
     const userData = await users.save();


     

     if(userData){
        //  sendVerifyMail(req.body.name, req.body.email, userData._id);
      res.render('addUser',{message:"user added succesfully"});
      sendPasswordMail (userData.email,userData.username,req.body.password,userData.usertype)
     }
    //  else{
    //   res.render('signup',{message:"user already exist."});
    //  }

    


   
  } 
  catch (error) {
      console.log(error.message);

  }
}

// logout
module.exports.destroySession = (req, res) => {
  try{
    req.session.destroy();
    res.redirect('/sign-in');
}
catch(error){
    console.log(error.message)
}
};
module.exports.companyUserlist = async(req, res) => {
  try {
    const usersData = await User.find({usertype:'company'})
       res.render('companyUserlist',{users:usersData});

}
catch (error) {
   console.log(error.message);
} 
};

module.exports.studentUserlist = async(req, res) => {
  try {
    const usersData = await User.find({usertype:'student'})
       res.render('studentUserlist',{users:usersData});

}
catch (error) {
   console.log(error.message);
} 
};

module.exports.removestudentUser = async(req,res)=>{
  try {
       const id = req.query.id;
       await User.deleteOne({_id:id})
      
          res.redirect('/studentuserlist');
       
  }

  catch (error) {
      console.log(error.message);
  } 
      
}
module.exports.removecompanyUser = async(req,res)=>{
  try {
       const id = req.query.id;
       await User.deleteOne({_id:id})
      
          res.redirect('/companyuserlist');
       
  }

  catch (error) {
      console.log(error.message);
  } 
      
}
