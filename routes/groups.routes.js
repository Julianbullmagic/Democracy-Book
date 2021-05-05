const express =require( 'express')
const router = express.Router();
const Rule = require("../models/rule.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const LocalGroup = require("../models/localgroup.model");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const userCtrl =require( '../controllers/user.controller')
const authCtrl =require( '../controllers/auth.controller')
const ExpertCandidate = require("../models/expertcandidate.model");
const ExpertNominee = require("../models/nominee.model");
require('dotenv').config();
const nodemailer = require('nodemailer');




router.get("/findgroupscoordinates", (req, res, next) => {
      const items=LocalGroup.find({ }, { _id: 1, centroid: 1 })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})

  router.put("/joinlocalgroup/:groupId/:userId", (req, res, next) => {
    let userId = req.params.userId;
    let groupId = req.params.groupId;
    console.log(userId)
    console.log(groupId)
        const updatedGroup=LocalGroup.findByIdAndUpdate(groupId, {$addToSet : {
        members:userId
      }}).exec()

  User.findByIdAndUpdate(
    { _id: userId },
    { localgroup: groupId },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );


      })


      router.get("/findlocalgroup/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
    console.log("groupidinlocalgrouprouote",groupId)
            const items=LocalGroup.findById(groupId).exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }
        })})



router.post("/createlocalgroup", (req, res, next) => {

   let newGroup = new LocalGroup({
     _id: new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
   });
   console.log("newgroup")
console.log(newGroup)

   newGroup.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })
})

router.get("/findgroups", (req, res, next) => {

      const items=Group.find()
      .populate('rules')
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})

  router.get("/populatemembers/:groupId", (req, res, next) => {
    let groupId = req.params.groupId;
console.log("groupid",groupId)
        const items=Group.find({_id:groupId})
        .populate('members')
        .populate('rules')
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{
                  res.status(200).json({
                              data: docs
                          });
        }
    })})

    router.get("/populatelocalmembers/:groupId", (req, res, next) => {
      let groupId = req.params.groupId;
  console.log("groupid",groupId)
          const items=LocalGroup.find({_id:groupId})
          .populate('members')
          .populate('rules')
          .exec(function(err,docs){
            if(err){
                    console.log(err);
                }else{
                    res.status(200).json({
                                data: docs
                            });
          }
      })})





    router.route('/join/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;


      const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
      members:userId
    }}).exec()


    })

    router.route('/splitgroup/').post((req, res) => {

var group=req.body
console.log("group",group)


   let newGroup = new Group({
     _id: new mongoose.Types.ObjectId(),
     title :req.body["title"],
     location:req.body["location"],
     description: req.body["description"],
     centroid: req.body["centroid"],
     rules: [...req.body["rules"]],
     members: [...req.body["members"]],

   });
   console.log("newgroup")
console.log(newGroup)

   newGroup.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })
   })



   router.route('/deletegroup/:id').delete((req, res) => {
     let groupid = req.params.id

    Group.findByIdAndDelete(groupid, function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Deleted : ", docs);
    }
});


   })



router.post("/add", (req, res, next) => {

   let newRule1= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule1"]
   })

   newRule1.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }})
   let newRule2= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule2"]
   })

   newRule2.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
    }})
   let newRule3= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule3"]
   })

   newRule3.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }})
   let newRule4= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule4"]
   })

   newRule4.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }})


   let newGroup = new Group({
     _id: new mongoose.Types.ObjectId(),
     title :req.body["title"],
     description: req.body["description"],
     centroid: req.body["centroid"],
     rules: [newRule1._id,newRule2._id,newRule3._id,newRule4._id],
   });
   console.log("newgroup")
console.log(newGroup)

   newGroup.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })

})



router.route("/checktime/:groupId").get((req, res) => {

let groupId=req.params.groupId
  Group.findById(groupId)
    .then(group => res.json(group))
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/:id').get((req, res) => {

let id=req.params.id
  Group.findById(id)
  .populate('rules')
  .populate('experts')
    .then(group => res.json(group))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
  Group.findByIdAndDelete(req.params.id)
    .then(() => res.json('Group deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/disapprove/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;
  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$addToSet : {
  disagree:userId
}}).exec()


})

router.route('/withdrawdisapproval/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;

  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
  disagree:userId
}}).exec()


})


router.route('/addexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Group.findByIdAndUpdate(userId, {$addToSet : {
  experts:userId
}}).exec()


})

router.route('/removeexpert/:userId').put((req, res) => {
  let userId = req.params.userId;
  const updatedRule=Rule.findByIdAndUpdate(userId, {$pull : {
  experts:userId
}}).exec()


})



router.route('/join/:groupId/:userId').put((req, res) => {
  let userId = req.params.userId;
  let groupId = req.params.groupId;


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
  members:userId
}}).exec()


})

router.route('/update/:id').post((req, res) => {
  Group.findById(req.params.id)
    .then(post => {
      post.name = req.body.name;
      post.category = req.body.category;
      post.image = req.body.image;
      post.text = req.body.text;
      post.date = req.body.date;

      post.save()
        .then(() => res.json('Group updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});




router.post('/sendelectionnotification/:groupName/:groupId', (req, res, next) => {
  console.log("send election notfication")
  var emails = req.body
  var groupId=req.params.groupId
var groupName=req.params.groupName


  if(emails.length>0){

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // naturally, replace both with your real credentials or an application-specific password
      }
    })
    const optionsArray=emails.map(email=>{
      const mailOptions = {
        from: "democracybooknews@gmail.com",
        to: email,
        subject: 'Election Notification',
        text: `The group called ${groupName} is having an election, please take the time to read the candidates\' experience and qualifications. If you don\'t have time for this, please abstain from voting. You have three days to make your decision`
      };
      return mailOptions
    })

    optionsArray.forEach(sendEmails)

    function sendEmails(item){
      transporter.sendMail(item, function(error, info){
        if (error) {
      	console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })

    }
  }})






  router.get("/findcandidates/:groupId", (req, res, next) => {
    console.log("finding candidates....")

        const items=ExpertCandidate.find({groupId:req.params.groupId})
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{

                  res.status(200).json({
                              data: docs
                          })
        }
    })})








router.post("/addCandidate", (req, res, next) => {


   let newCandidate= new ExpertCandidate({
     _id:new mongoose.Types.ObjectId(),
     name:req.body['name'],
     userId:req.body['userId'],
     groupId:req.body['groupId'],
     qualifications: req.body['qualifications'],
     workexperience: req.body['workexperience'],
     votes:[...req.body['votes']]
   })
   console.log(newCandidate)


   newCandidate.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Item was saved successfully"
      })
     }
   })

})



router.route('/havingelection/:groupId').put((req, res) => {
  let groupId = req.params.groupId

  const updatedGroup=Group.findByIdAndUpdate({ _id: groupId },
    {havingelection:true,electionstart: new Date  })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{

                res.status(200).json({
                            data: docs
                        })}

})})

router.route('/expertwinners/:groupId').put((req, res) => {
  let groupId = req.params.groupId

  const updatedGroup=Group.findByIdAndUpdate({ _id: groupId },
    {experts:req.body})
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{

                res.status(200).json({
                            data: docs
                        })}

})})




router.route('/clearcandidates/:groupId').delete((req, res) => {
  let groupId = req.params.groupId

  const updatedGroup=ExpertCandidate.deleteMany({ groupId: groupId })
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{

                res.status(200).json({
                            data: docs
                        })}

})})


router.route('/electionend/:groupId').put((req, res) => {
  let groupId = req.params.groupId

  const updatedGroup=Group.findByIdAndUpdate({ _id: groupId },
    {havingelection:false,secondelectionnotification:false})
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{

                res.status(200).json({
                            data: docs
                        })}

})})



router.route('/getelectiontimer/:groupId').put((req, res) => {
  let groupId = req.params.groupId

  const updatedNominee=Group.findById({_id:groupId})
  .exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
                        data: docs
                    })}

})})

router.route('/getmembers/:groupid').get((req, res) => {
  let groupId = req.params.groupid

  Group.findById({_id:groupId})
.populate('members')
.populate('experts')
  .exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
                        data: docs
                    })
  }
  console.log("get member docs")
console.log(docs)  })
})


router.route('/getgroupdata/:groupid').get((req, res) => {
  let groupId = req.params.groupid
  console.log("GROUPID",groupId)

  Group.findById({_id:groupId})
.populate('members')
.populate('experts')
  .exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
                        data: docs
                    })
  }
  console.log("get group data docs")
console.log(docs)  })
})


router.route('/approveofnominee/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedCandidate=ExpertNominee.findByIdAndUpdate(candidateId, {$addToSet : {
  votes:userId
}}).exec()


})

router.route('/withdrawapprovalofnominee/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedNominee=ExpertNominee.findByIdAndUpdate(candidateId, {$pull : {
  votes:userId
}}).exec()


})

router.route('/approveofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;
  console.log("giving approval")


  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$addToSet : {
  votes:userId
}}).exec()


})

router.route('/withdrawapprovalofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;
  console.log("withdrawing approval")

  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$pull : {
  votes:userId
}}).exec()


})






router.route('/:id').get((req, res) => {
  ExpertNominee.findById(req.params.id)
  .populate('rules')
    .then(group => res.json(group))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/deleteNominee/:id').delete((req, res) => {
  ExpertNominee.findByIdAndDelete(req.params.id)
    .then(() => res.json('ExpertNominee deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});






router.route('/withdrawdisapproval/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;

  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
  disagree:userId
}}).exec()


})

//
// router.route('/addexpert/:userId').put((req, res) => {
//   let userId = req.params.userId;
//   const updatedRule=ExpertNominee.findByIdAndUpdate(userId, {$addToSet : {
//   experts:userId
// }}).exec()
//
//
// })
//
// router.route('/removeexpert/:userId').put((req, res) => {
//   let userId = req.params.userId;
//   const updatedRule=Rule.findByIdAndUpdate(userId, {$pull : {
//   experts:userId
// }}).exec()
//
//
// })




router.route('/update/:id').post((req, res) => {
  ExpertNominee.findById(req.params.id)
    .then(post => {
      post.name = req.body.name;
      post.category = req.body.category;
      post.image = req.body.image;
      post.text = req.body.text;
      post.date = req.body.date;

      post.save()
        .then(() => res.json('ExpertNominee updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/getemails/:groupid').get((req, res) => {

  Group.findById(req.params.groupid)
.populate('members')

.populate('experts')
  .exec(function(err,docs){
    if(err){
            console.log(err);
        }else{

            res.status(200).json({
                        data: docs
                    })
  }
  })
})





function sendElectionReminder(){
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
    user: process.env.EMAIL, // TODO: your gmail account
    pass: process.env.PASSWORD // TODO: your gmail password
}
});

// Step 2
let mailOptions = {
from: 'DemocracyBookUpdates@gmail.com', // TODO: email sender
to: 'Julianbullmagic@gmail.com', // TODO: email receiver
subject: 'Nodemailer - Test',
text: 'Wooohooo it works!!'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
if (err) {
    return log('Error occurs');
}
return log('Email sent!!!');
})
}



module.exports= router
