const nodemailer = require ('nodemailer');
const Interview = require("../models/interview");
const Student = require("../models/student");
const Application = require("../models/application");

module.exports.jobPost = async(req, res) => {
  try {
    const usersData = await Interview.find({})
       res.render('Job-post',{interview:usersData});

}
catch (error) {
   console.log(error.message);
} 
};

// send mail for seleceted
const sendMail = async(email,name,company,date)=>{
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
      subject:'notification of interview',
      html:'<P>Congratulations , hello '+name+' your shortlisted by '+company+' and your interview on '+date+' </p>'
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

// send mail for pass
const sendPassMail = async(email,name,company,date)=>{
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
      subject:'notification of interview',
      html:'<P>Congratulations , hello '+name+' you passed interview of '+company+' which held on '+date+' </p>'
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





// renders the addInterview page
module.exports.addInterview = (req, res) => {
 
    return res.render("add_interview", {
      title: "Schedule An Interview",
    });
  

};

// creating a new interview
module.exports.create = async (req, res) => {
  try {
    const { company,jobPost,vacancy,date } = req.body;

    await Interview.create(
      {
        company,
        jobPost,
        vacancy,
        date,
      },
      (err, Interview) => {
        if (err) {
          return res.redirect("back");
        }
        return res.redirect("back");
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// Enrolling student in the interview
module.exports.enrollInInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);
    const { email, result } = req.body;
    const userdata = await Student.findOne({ email: email });
    if(userdata){
      if(result==='Selected'){
      sendMail(req.body.email,userdata.name,interview.company,interview.date)
      }
      else if(result==='PASS'){
      sendPassMail(req.body.email,userdata.name,interview.company,interview.date)
      }
    }


    if (interview) {
      let student = await Student.findOne({ email: email });
     
      if (student) {
        // check if already enroll
        let alreadyEnrolled = await Interview.findOne({
          "students.student": student.id,
        });

        // preventing student from enrolling in same company more than once
        if (alreadyEnrolled) {
          if (alreadyEnrolled.company === interview.company) {
            req.flash(
              "error",
              `${student.name} already enrolled in ${interview.company} interview!`
            );
         
            return res.redirect("back");
          }
        }

        let studentObj = {
          student: student.id,
          result: result,
        };

        // updating students field of interview by putting reference of newly enrolled student
         await interview.updateOne({
          $push: { students: studentObj },
        });
       
       

        // updating interview of student
        let assignedInterview = {
          company: interview.company,
          date: interview.date,
          result: result,
        };
        await student.updateOne({
          $push: { interviews: assignedInterview },
        });
        console.log(
          "success",
          `${student.name} enrolled in ${interview.company} interview!`
        );
        return res.redirect("back");
      }
      return res.redirect("back");
    }
    return res.redirect("back");
  } catch (err) {
    console.log("error", "Error in enrolling interview!");
  }
};

// deallocating students from an interview
module.exports.deallocate = async (req, res) => {
  try {
    const { studentId, interviewId } = req.params;

    // find the interview
    const interview = await Interview.findById(interviewId);

    if (interview) {
      // remove reference of student from interview schema
      await Interview.findOneAndUpdate(
        { _id: interviewId },
        { $pull: { students: { student: studentId } } }
      );

      // remove interview from student's schema using interview's company
      await Student.findOneAndUpdate(
        { _id: studentId },
        { $pull: { interviews: { company: interview.company } } }
      );
      return res.redirect("back");
    }
    return res.redirect("back");
  } catch (err) {
    console.log("error", "Couldn't deallocate from interview");
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const {interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return;
    }

    const studentsOfInterview = interview.students;

    // delete reference of student from companies in which this student is enrolled
    if (studentsOfInterview.length > 0) {
      for (let student of studentsOfInterview) {
        await Student.findOneAndUpdate(
          { company: interview.company },
          { $pull: { interviews: { interview: interviewId } } }
        );
      }
    }

    interview.remove();
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return;
  }
};

// apply for job-post
module.exports.apply = (req, res) => {
 
  return res.render("apply.ejs");
};

// save apply data in application database
module.exports.createapply = async (req, res) => {
  try {
        
    const application = new Application({
       
        name:req.body.name,
        email:req.body.email,
        jobPost:req.body.jobPost,
        company:req.body.company,
        resume:req.file.filename,
    });


    const studentData = await application.save();
   if(studentData){
    res.render('apply',{message:"application send successfully"});
   }
   else{
    res.render('apply',{message:"application send failed."});
   }
} 
catch (error) {
    console.log(error.message);

}
}





