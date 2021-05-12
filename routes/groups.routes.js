const express =require( 'express')
const router = express.Router();
const userCtrl =require( '../controllers/user.controller')
const authCtrl =require( '../controllers/auth.controller')
const ExpertCandidate = require("../models/expertcandidate.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
require('dotenv').config();
const nodemailer = require('nodemailer');
const Rule = require("../models/rule.model");
const LocalGroup = require("../models/localgroup.model");
const HigherLevelGroup = require("../models/higherlevelgroup.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);


router.put("/joinhigherlevelgroup/:groupId/:userId", (req, res, next) => {
  let userId = req.params.userId;
  let groupId = req.params.groupId;
  console.log(userId)
  console.log(groupId)
      const updatedGroup=HigherLevelGroup.findByIdAndUpdate(groupId, {$addToSet : {
      members:userId
    }}).exec()

User.findByIdAndUpdate(
  { _id: userId },
  { higherlevelgrouptheybelongto: groupId },
  function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  }
)
    })


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







router.delete("/removecandidate/:nomineeId", (req, res, next) => {
  nomineeid=req.params.nomineeId
  ExpertCandidate.findByIdAndDelete(nomineeid, function (err, docs) {
  if (err){
      console.log(err)
  }
  else{
      console.log("Deleted : ", docs);
  }
});
})

router.post("/nominatecandidate/", (req, res, next) => {

   let newCandidate= new ExpertCandidate({
     _id:req.body._id,
     name:req.body.name,
     expertise:req.body.expertise,
     timecreated:req.body.timecreated,
     userId:req.body.userId,
     groupId:req.body.groupId,
     votes:[...req.body.votes]
      })
   console.log("new candidate",newCandidate)


   newCandidate.save((err,candidate) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       console.log("candidate ID",candidate._id)
       res.status(201).json({
         message: "Candidate was saved successfully",
         id:candidate._id
      })
     }
   })
})


router.route('/addnomineetogroupobject/:nominee/:group').put((req, res) => {
  let nomineeId = req.params.nominee
  let groupId = req.params.group;


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$addToSet : {
  expertcandidates:nomineeId
}}).exec()


})

router.route('/resetleaderreview/:groupId').put((req, res) => {
  let groupId = req.params.groupId;
console.log("timenow",req.body)
  const updatedGroup=Group.findByIdAndUpdate(groupId, {
  lastcandidateshuffle:req.body
}).exec()


})

router.route('/resetcandidatesaftershuffle/:groupId').put((req, res) => {
  let groupId = req.params.groupId;
  console.log("candidates being reset after shuffle",req.body)
  const updatedGroup=Group.findByIdAndUpdate(groupId, {
  expertcandidates:req.body
}).exec()


})

router.route('/updateleaders/:groupId').put((req, res) => {
  let groupId = req.params.groupId;
  console.log("updating leaders",req.body)
  const updatedGroup=Group.findByIdAndUpdate(groupId, {
  leaders:req.body
}).exec()


})


router.route('/removenomineefromgroupobject/:nominee/:group').put((req, res) => {
  let nomineeId = req.params.nominee
  let groupId = req.params.group;
  console.log("removing candidate from group object",nomineeId,groupId)


  const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
  expertcandidates:nomineeId
}}).exec()


})










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
   })
})










router.route('/approveofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;



  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$addToSet : {
  votes:userId
}}).exec()


})

router.route('/withdrawapprovalofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$pull : {
  votes:userId
}}).exec()


})






router.route('/withdrawdisapproval/:ruleId/:userId').put((req, res) => {
  let ruleId = req.params.ruleId
  let userId = req.params.userId;

  const updatedRule=Rule.findByIdAndUpdate(ruleId, {$pull : {
  disagree:userId
}}).exec()


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



router.get("/findgroupscoordinates", (req, res, next) => {
      const items=Group.find({ }, { _id: 1, centroid: 1 })
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
            const items=Group.findById(groupId).exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }
        })})


              router.get("/findlocalgroups/:groupId", (req, res, next) => {
                let groupId = req.params.groupId;
                    const items=Group.findById(groupId).exec(function(err,docs){
                      if(err){
                              console.log(err);
                          }else{
                              res.status(200).json({
                                          data: docs
                                      });
                    }
                })})




router.post("/createlocalgroup", (req, res, next) => {

   let newGroup = new Group({
     _id: new mongoose.Types.ObjectId(),
     location:req.body['location'],
     centroid: req.body["centroid"],
   });


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
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{
                res.status(200).json({
                            data: docs
                        });
      }

  })})

  router.put("/updateradius/:groupId/:radius", (req, res, next) => {
    let radius = req.params.radius;
    let groupId = req.params.groupId;



  Group.findByIdAndUpdate(
    { _id: groupId },
    { radius: radius },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );


      })


      router.put("/addhighergrouptolowergroup/:higherId/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
        let higherId = req.params.higherId;




      Group.findByIdAndUpdate(
        { _id: groupId },
        { higherlevelgroup: higherId },
        function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );


          })

  router.get("/populatemembers/:groupId", (req, res, next) => {
    let groupId = req.params.groupId;
console.log("populating members")
        const items=Group.find({_id:groupId})
        .populate('members')
        .populate('rules')
        .populate('leaders')
        .populate('expertcandidates')
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{
                console.log("docs",docs)
                  res.status(200).json({
                              data: docs
                          });
        }
    })})



        router.put("/changelocalgroupsofmembers/:groupid/:memberid", (req, res, next) => {
          let groupId = req.params.groupid;
          let memberId = req.params.memberid;
          console.log(userId)
          console.log(groupId)
          console.log("CHANGING LOCAL GROUPS OF USER OBJECTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


        User.findByIdAndUpdate(
          memberId,
          { localgroup: groupId },
          function(err, result) {
            if (err) {
              res.send(err);
            } else {
              res.send(result);
            }
          }
        )
            })


      router.get("/findhigherlevelgroups", (req, res, next) => {

            const items=HigherLevelGroup.find()
            .exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                      res.status(200).json({
                                  data: docs
                              });
            }

        })})

      router.get("/populatemembersbelow/:groupId", (req, res, next) => {
        let groupId = req.params.groupId;
    console.log("populating members")
            const items=Group.find({_id:groupId})
            .populate('members')
            .populate('rules')
            .populate('leaders')
            .populate('expertcandidates')
            .exec(function(err,docs){
              if(err){
                      console.log(err);
                  }else{
                    console.log("docs",docs)
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

    router.route('/leave/:groupId/:userId').put((req, res) => {
      let userId = req.params.userId;
      let groupId = req.params.groupId;


      const updatedGroup=Group.findByIdAndUpdate(groupId, {$pull : {
      members:userId
    }}).exec()


    })

    router.route('/newlowerlevelgroup/').post((req, res) => {
   let newGroup = new Group({
     _id: req.body["_id"],
     title :req.body["title"],
     location:req.body["location"],
     description: req.body["description"],
     centroid: req.body["centroid"],
     rules: [...req.body["rules"]],
     members: [...req.body["members"]],

   });

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






   }
   )


   router.route('/assignnewlowerlevelgroup/:group').put((req, res) => {
     console.log(req.body)
   var members=[...req.body]
   for(var member of members){
     const updatedGroup=Group.findByIdAndUpdate(member, {
     localgroup:req.params.group
   }).exec()

   }
   })



       router.route('/newhigherlevelgroup/').post((req, res) => {

      let newGroup = new HigherLevelGroup({
        _id: req.body["_id"],
        title :req.body["title"],
        location:req.body["location"],
        lastcandidateshuffle:req.body["lastcandidateshuffle"],
        description: req.body["description"],
        centroid: req.body["centroid"],
        rules: req.body["rules"],
        members: req.body["members"],
        allmembers: req.body["allmembers"],
        lowerGroupIds:req.body["newLowerGroupIds"]

      });



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





module.exports= router
