
const Application = require("../models/application");
const Interview = require("../models/interview");
const Student = require("../models/student");


// render add student page
module.exports.addStudent = (req, res) => {
 
    return res.render("add_student", {
      title: "Add Student",
    });
};

// render edit student page
module.exports.editStudent = async (req, res) => {
  const student = await Student.findById(req.params.id);


    return res.render("edit_student", {
      title: "Edit Student",
      student_details: student,
    });

};

// creating a new Student
module.exports.create = async (req, res) => {
  try {
        
    const student = new Student({
       
        name:req.body.name,
        email:req.body.email,
        batch:req.body.batch,
        college:req.body.college,
        placementStatus:req.body.placementStatus,
        dsa_score:req.body.dsa_score,
        react_score:req.body.react_score,
        webdev_score:req.body.webdev_score,
        image:req.file.filename,
    });


    const studentData = await student.save();
   if(studentData){
    res.render('add_student',{message:"your enrolled successfully"});
   }
   else{
    res.render('add_student',{message:"enrolling fail"});
   }
} 
catch (error) {
    console.log(error.message);

}
}

// Deletion of student
module.exports.destroy = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findById(studentId);

    if (!student) {
      return;
    }

    const interviewsOfStudent = student.interviews;

    // delete reference of student from companies in which this student is enrolled
    if (interviewsOfStudent.length > 0) {
      for (let interview of interviewsOfStudent) {
        await Interview.findOneAndUpdate(
          { company: interview.company },
          { $pull: { students: { student: studentId } } }
        );
      }
    }

    student.remove();
    return res.redirect("back");
  } catch (err) {
    console.log("error", err);
    return;
  }
};

// update student details
module.exports.update = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const {
      name,
      college,
      batch,
      dsa_score,
      react_score,
      webdev_score,
      placementStatus,
    } = req.body;

    if (!student) {
      return res.redirect("back");
    }

    student.name = name;
    student.college = college;
    student.batch = batch;
    student.dsa_score = dsa_score;
    student.react_score = react_score;
    student.webdev_score = webdev_score;
    student.placementStatus = placementStatus;

    student.save();
    return res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

module.exports.viewApplication= async(req, res) => {
  try {

    var search = '';
    if(req.query.search){
      search = req.query.search;
    }



    const usersData = await Application.find({
      $or:[
        { name:{ $regex:'.*'+search+'.*',$options:'i'}},
        { email:{ $regex:'.*'+search+'.*',$options:'i'}},
        { company:{ $regex:'.*'+search+'.*',$options:'i'}}
      ]
    })
   
       res.render('viewApplication',{application:usersData});

}
catch (error) {
   console.log(error.message);
} 
};

module.exports.removeApplication = async(req,res)=>{
  try {
       const id= req.query.id;
       await Application.deleteOne({_id:id})
      
          res.redirect('viewApplication');
       
  }

  catch (error) {
      console.log(error.message);
  } 
      
}



