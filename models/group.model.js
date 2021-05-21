const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
  },
  lastcandidateshuffle:Number,
  randomsample:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  centroid:[Number],
  higherlevelgroup:{type:mongoose.Schema.Types.ObjectId,ref:"HigherLevelGroup"},
  radius:Number,
  leaders:[{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates: [{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],

})

module.exports =  mongoose.model('Group', groupSchema)
