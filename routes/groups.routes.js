const express =require( 'express')
const router = express.Router();
const Rule = require("../models/rule.model");
const Group = require("../models/group.model");
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);


router.get("/findgroups", (req, res, next) => {
  console.log("getting groups data")

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





router.post("/add", (req, res, next) => {
  console.log("info in router")

   let newRule1= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule1"]
   })
console.log("newRule")
console.log(newRule1)
   newRule1.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }
   })
   let newRule2= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule2"]
   })
   console.log("newRule2")
   console.log(newRule2)
   newRule2.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }
   })
   let newRule3= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule3"]
   })
   console.log("newRule3")
   console.log(newRule3)
   newRule3.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }
   })
   let newRule4= new Rule({
     _id:new mongoose.Types.ObjectId(),
     rule: req.body["rule4"]
   })
   console.log("newRule4")
   console.log(newRule4)
   newRule4.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }
   })


   let newGroup = new Group({
     _id: new mongoose.Types.ObjectId(),
     title :req.body["title"],
     description: req.body["description"],
     rules: [newRule1._id,newRule2._id,newRule3._id,newRule4._id],
   });
   console.log("new group")
console.log(newGroup)


   newGroup.save((err) => {
     if(err){
       res.status(400).json({
         message: "The Item was not saved",
         errorMessage : err.message
      })
     }else{
       res.status(201).json({
         message: "Group was saved successfully"
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



module.exports= router
