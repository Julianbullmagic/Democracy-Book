const express =require( 'express')
const router = express.Router();

const Item = require("../models/item.model");
const User = require("../models/user.model");

const mongoose = require("mongoose");
mongoose.set('useFindAndModify', true);



router.get("/", (req, res, next) => {
console.log("marketplace route")
      const items=Item.find()
      .exec(function(err,docs){
        if(err){
                console.log(err);
            }else{

                res.status(200).json({
                            data: docs
                        });
      }
  })})

  router.get("/findcandidates/:groupId", (req, res, next) => {

        const items=ExpertCandidate.find({groupId:req.params.groupId})
        .exec(function(err,docs){
          if(err){
                  console.log(err);
              }else{

                  res.status(200).json({
                              data: docs
                          });
        }
    })})


router.post("/add/:userId", (req, res, next) => {

   let newItem= new Item({
     _id:new mongoose.Types.ObjectId(),
     title:req.body['title'],
     description:req.body['description'],
     createdby:req.params.userId,
     priceorrate:req.body['priceorrate'],
     labourtime:req.body['labourtime']

   })
   console.log(newItem)


   newItem.save((err) => {
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



router.post("/addCandidate", (req, res, next) => {


   let newCandidate= new ExpertCandidate({
     _id:new mongoose.Types.ObjectId(),
     name:req.body['name'],
     userId:req.body['userId'],
     groupId:req.body['groupId'],
     qualifications: req.body['qualifications'],
     workexperience: req.body['workexperience'],
     votes:[req.params.userId]
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


router.route('/markNominee/:nomineeId').put((req, res) => {
  let nomineeId = req.params.nomineeId

  const updatedNominee=ExpertNominee.findByIdAndUpdate({ _id: nomineeId },
    { isCandidate: true },).exec()


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

  const updatedCandidate=ExpertCandidate.findByIdAndUpdate(candidateId, {$addToSet : {
  votes:userId
}}).exec()


})

router.route('/withdrawapprovalofcandidate/:candidateId/:userId').put((req, res) => {
  let candidateId = req.params.candidateId
  let userId = req.params.userId;

  const updatedNominee=ExpertCandidate.findByIdAndUpdate(candidateId, {$pull : {
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



module.exports= router
