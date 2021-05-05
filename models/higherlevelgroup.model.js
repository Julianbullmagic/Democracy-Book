const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  lastcandidateshuffle:Number,
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
  },
  centroid:[Number],
  leaders:[{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  randomsampleofmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  allmembers: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates: [{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],

})

module.exports =  mongoose.model('HigherLevelGroup', groupSchema)
