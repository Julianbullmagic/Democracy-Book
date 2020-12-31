import express from 'express'
const router = express.Router();
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
const ExpertCandidate = require("../models/expertcandidate.model");
const ExpertNominee = require("../models/nominee.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', true);
require('dotenv').config();
const nodemailer = require('nodemailer');



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




  router.post('/sendelectionnotification2/:groupName/:groupId', (req, res, next) => {
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
          text: `The group called ${groupName} is having an election, please take the time to read the candidates\' experience and qualifications. If you don\'t have time for this, please abstain from voting. You have 2 days left to make your decision`
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



      router.post('/sendelectionnotification3/:groupName/:groupId', (req, res, next) => {
        console.log("send election notfication")
        var emails = req.body
        var groupId=req.params.groupId
      var groupName=req.params.groupName


        if(emails.length>0){

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD
            }
          })
          const optionsArray=emails.map(email=>{
            const mailOptions = {
              from: "democracybooknews@gmail.com",
              to: email,
              subject: 'Election Notification',
              text: `The group called ${groupName} has just finished an election. Visit the page to check who won`
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
        }





})






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

router.route('/secondelectionnotification/:groupId').put((req, res) => {
  let groupId = req.params.groupId

  const updatedGroup=Group.findByIdAndUpdate({ _id: groupId },
    {secondelectionnotification:false})
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
