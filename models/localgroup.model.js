const mongoose = require('mongoose');




const localGroupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  location: {
    type: String,
  },
  centroid:[Number],
    radius:Number,
  lastcandidateshuffle:Number,
  higherlevelgroup:{type:mongoose.Schema.Types.ObjectId},
  leaders:[{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates: [{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],

})

module.exports =  mongoose.model('LocalGroup', localGroupSchema)
