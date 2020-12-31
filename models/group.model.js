const mongoose = require('mongoose');




const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  havingelection:{ type:Boolean,default:false },
  secondelectionnotification:{ type:Boolean,default:false },

electionstart:{ type: Date },
  rules: [{type:mongoose.Schema.Types.ObjectId,ref:"Rule"}],
  members: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
  expertcandidates: [{type:mongoose.Schema.Types.ObjectId,ref:"ExpertCandidate"}],
  experts: [{type:mongoose.Schema.Types.ObjectId,ref:"User"}]

})

module.exports =  mongoose.model('Group', groupSchema)
