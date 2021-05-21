import React, {useState, useEffect} from 'react'
import Expertfeed from './../post/Expertfeed'
import auth from './../auth/auth-helper'

const mongoose = require("mongoose");


export default function ExpertComponent(props) {

const [loading, setLoading] = useState(false);
const [groupData, setGroupData] = useState({
  _id:'',
centroid:[],
randomsample:[],
leaders:[],
lastcandidateshuffle:'',
rules:[],
members:[],
expertcandidates:[],
location:"",
radius:""
});
const [toggleNominations, setToggleNominations] = useState(false);
const [toggleViewCandidates, setToggleViewCandidates] = useState(false);
const [members,setMembers]=useState()
const [groupId,setGroupId]=useState(props.groupId)



useEffect(() => {
fetchGroupData()
},[])


useEffect(() => {
  checkWinner()
  updateLeaders()
  props.updateLeaders(groupData.leaders)
},[groupData,setGroupData])



async function updateLeaders(){


var leaderids=groupData.leaders.map(item=>{return item._id})
console.log("leader ids",leaderids)
   const options = {
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     },
        body: JSON.stringify(leaderids)
   }

  await fetch("/"+props.grouptype+"/updateleaders/"+groupId, options
  ).then(res => {
  console.log(res);
  }).catch(err => {
  console.log(err);
  })
//
//   if (groupData.higherlevelgroup){
//
// var leadermembers=[]
// for (var member of members){
//   if(leaderids.includes(member._id)){
//     leadermembers.push(member)
//   }
// }
// var leadermemberids=leadermembers.map(item=>{return item._id})
// var memberids=members.map(item=>{return item._id})
// var higherlevelmembers=JSON.parse(JSON.stringify(groupData.higherlevelgroup.members))
// var higherlevelmemberids=higherlevelmembers.map(item=>{return item._id})
//
// for (var representative of representativeids){
//   if(!higherlevelmemberids.includes(representative)){
// addRepresentativeToHigherLevel(representative)
//   }
// }
//
// for(var member of memberids){
//   if (higherlevelmemberids.includes(member)&&!representativeids.includes(member)){
//     recallRepresentativeFromHigherLevel(member)
//   }
// }
//
//
//
//
//   }

}

function addRepresentativeToHigherLevel(representative){
  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body:''
  }

fetch("/"+props.grouptype+"/addrepresentativetohighergroup/"+groupData.higherlevelgroup._id+"/"+representative, options
 ).then(res => {
 console.log(res);
 }).catch(err => {
 console.log(err);
 })
}

function recallRepresentativeFromHigherLevel(representative){
  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body:''
  }

 fetch("/"+props.grouptype+"/recallmemberfromhighergroup/"+groupData.higherlevelgroup._id+"/"+representative, options
 ).then(res => {
 console.log(res);
 }).catch(err => {
 console.log(err);
 })
}


function toggleNominationsFunction(){
  setToggleNominations(!toggleNominations)
}


function toggleViewCandidatesFunction(){
  setToggleViewCandidates(!toggleViewCandidates)
}




function checkWinner(){
if (groupData.expertcandidates.length>0){
var expertcandidatescopy=JSON.parse(JSON.stringify(groupData.expertcandidates))



var sortedcandidates=expertcandidatescopy.sort((a, b) => (a.votes.length < b.votes.length) ? 1 : -1)
var sortedcandidatestop4=sortedcandidates.slice(0,2)
console.log("sortedcandidatestop4",sortedcandidatestop4)
setGroupData({...groupData,leaders:sortedcandidatestop4})
}
}

function shuffleCandidates(){

  var expertcandidatescopy=JSON.parse(JSON.stringify(groupData.expertcandidates))
  shuffle(expertcandidatescopy)
return expertcandidatescopy

}




function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


function checkLastCandidateShuffle(group){

  var timenow=new Date().setHours(0,0,0,0)

console.log("last candidate shuffle",group)

//2592000000
if(((timenow-group.lastcandidateshuffle)>10000)&&group.expertcandidates.length>1){

var data
console.log("all members",group.allmembers)
if(group.allmembers){
  var allmemberscopy=[...group.allmembers]
  shuffle(allmemberscopy)
  console.log("SHUFFLED ALL MEMBERS",allmemberscopy)
  data={
    lastcandidateshuffle:timenow,
    randomsample:allmemberscopy
  }
  console.log("DATA",data)

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body: JSON.stringify(data)
  }

  fetch("/"+props.grouptype+"/resethigherlevelleaderreview/"+groupId, options
 ).then(res => {
 console.log(res);
 }).catch(err => {
 console.log(err);
 })

 }


 console.log("members",group.members)
  var memberscopy=[...group.members]
  var memberids=memberscopy.map(item=> item._id)
  shuffle(memberids)
  console.log("SHUFFLED MEMBERS",memberids)
  data={
    lastcandidateshuffle:timenow,
    randomsample:memberids
  }
  console.log("DATA",data)

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body: JSON.stringify(data)
  }

  fetch("/"+props.grouptype+"/resetleaderreview/"+groupId, options
 ).then(res => {
 console.log(res);
 }).catch(err => {
 console.log(err);
 })











var expertcandidates=shuffleCandidates()
var candidateids=expertcandidates.map(item=>{return item._id})

 const options2 = {
   method: 'put',
   headers: {
     'Content-Type': 'application/json'
   },
      body: JSON.stringify(candidateids)
 }

 fetch("/"+props.grouptype+"/resetcandidatesaftershuffle/"+groupId, options2
).then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})

}
}




function fetchGroupData(){

console.log("props",props.highorlow)
if(props.highorlow=="higher"){
  fetch("/"+props.grouptype+"/populatehigherlevelmembersbelow/"+props.groupId)
  .then(result => {return result.json()})
  .then(response =>{
      console.log("response.data higher",response['data'])
      setGroupData(response['data'][0])
setLoading(true)

  var groupDataCopy=JSON.parse(JSON.stringify(response["data"][0]))
  var currenttime=new Date().getTime()
  for (const candidate of groupDataCopy.expertcandidates){
    const diff=currenttime-candidate.timecreated
  if(diff>86400000&&candidate.votes.length<2){
  removeCandidate(candidate._id,groupId)
  }
  }


  })
}

if(props.highorlow=="lower"){

  console.log("fetching lower")
  fetch("/"+props.grouptype+"/populatemembersbelow/"+props.groupId)
  .then(result => result.json())
  .then(response =>{
      console.log("response.data lower",response['data'])
      setGroupData(response['data'][0])
setLoading(true)
checkLastCandidateShuffle(response['data'][0])

  var groupDataCopy=JSON.parse(JSON.stringify(response["data"][0]))
  var currenttime=new Date().getTime()
  for (const candidate of groupDataCopy.expertcandidates){
    const diff=currenttime-candidate.timecreated
  if(diff>86400000&&candidate.votes.length<2){
  removeCandidate(candidate._id,groupId)
  }
  }


  })
}



}





      function approve(e,candidateId){


var userId=auth.isAuthenticated().user._id

var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))

        for (const candidate of candidatesCopy) {

          if (candidate._id==candidateId){
          const included=candidate.votes.includes(userId)

          if(!included){
            candidate.votes.push(auth.isAuthenticated().user._id)

            setGroupData({...groupData,expertcandidates:candidatesCopy})

          }
        }
      }
      setGroupData({...groupData,expertcandidates:candidatesCopy})


        }

   function giveapproval(e,candidateId){
approve(e,candidateId)

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+props.grouptype+"/approveofcandidate/" + candidateId +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}




function disapprove(e,candidateId){


var userId=auth.isAuthenticated().user._id

var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))


  for (const candidate of candidatesCopy) {

    if (candidate._id==candidateId){


    const included=candidate.votes.includes(userId)

    if(included){

      for (let i = 0; i < candidate.votes.length; i++) {
        if (candidate['votes'][i] == auth.isAuthenticated().user._id) {
          candidate.votes.splice(i, 1);
        }
      }



    }
  }
  }
  setGroupData({...groupData,expertcandidates:candidatesCopy})

  }

function givedisapproval(e,candidateId){
disapprove(e,candidateId)

   const options = {
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     },
        body: ''
   }

   fetch("/"+props.grouptype+"/withdrawapprovalofcandidate/" + candidateId +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})

}







      function nominate(e,nomineeId,nomineeName,nomineeexpertise){


console.log("nominee id",nomineeId)
  const newCandidate= {
    _id:mongoose.Types.ObjectId(),
    userId:nomineeId,
    groupId:groupId,
    name: nomineeName,
    expertise:nomineeexpertise,
    timecreated:new Date().getTime(),
    votes:[auth.isAuthenticated().user._id]
  }
console.log("new candidate",newCandidate)

  var justnames=groupData.expertcandidates.map(item=>{return item.name})
console.log("candidates",groupData.expertcandidates,justnames,groupData,newCandidate)

if(!justnames.includes(newCandidate.name)){


  var candidatesCopy=JSON.parse(JSON.stringify(groupData.expertcandidates))
  candidatesCopy.push(newCandidate)
  setGroupData({...groupData,expertcandidates:candidatesCopy})



  const options = {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
     body: JSON.stringify(newCandidate)
  }

  fetch("/"+props.grouptype+"/nominatecandidate/", options
  ).then(res => res.json())
  .then(res => {
console.log(res)
addNomineeToGroupObject(res.id)
  }).catch(err => {
  console.log(err);
  })

}

}



function addNomineeToGroupObject(candidateId){
  console.log("candidateId and groupId",candidateId,groupId)
  const options2 = {
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

fetch("/"+props.grouptype+"/addnomineetogroupobject/" + candidateId + "/" +groupId, options2
) .then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
}





      function removeCandidate(nomineeId,groupId){

             const options = {
             method: 'delete',
             headers: {
               'Content-Type': 'application/json'
             },
                body: ''
           }

         fetch("/"+props.grouptype+"/removecandidate/" + nomineeId, options
  ).then(res => res.json())
  .then(res => {
  console.log(res);
  })
  .catch(err => {
      console.log(err);
    })

removeNomineeFromGroupObject(nomineeId,groupId)


}



function removeNomineeFromGroupObject(candidateId,groupId){
  const options = {
  method: 'put',
  headers: {
    'Content-Type': 'application/json'
  },
     body: ''
}

fetch("/"+props.grouptype+"/removenomineefromgroupobject/" + candidateId + "/" +groupId, options
).then(res => {
  res.json()
})
.then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
}






var leadersmapped= <h3>No Experts Yet, nominate some candidates</h3>

if(groupData.leaders){
leadersmapped=groupData.leaders.map(item=>{



 return(
   <>
   <h3>{item.name}</h3>
</>
)
}
)
}


var candidatesmapped=<h3>No Candidates</h3>
if(groupData.expertcandidates){
candidatesmapped=groupData.expertcandidates.map(item => {

  let votes=[]
  let approval=<h5></h5>

  if(item.votes){
   votes=[...item.votes]
   if(votes.length==0){
     approval=<h5>No approval</h5>

 }
   if(votes.length==1){
   approval=<h5>{votes.length} member approves of this candidate</h5>
   }
   if(votes.length>1){
   approval=<h5>{votes.length} members approve of this candidate</h5>
 }}

 return(
   <>
   <h3>{item.name}</h3>
<p>{item.expertise}</p>
<button onClick={(e)=>giveapproval(e,item._id)}>Approve of Candidate?</button>
<button onClick={(e)=>givedisapproval(e,item._id)}>Remove Approval?</button>
{approval}

</>
)})}


var membersmapped=<h3>No Members</h3>

 if(groupData.members){


 membersmapped=groupData.members.map(item => {
   return(
     <>
     <h3>{item.name}</h3>
     <h1>Expertise/skills/qualifications/leadership experience :{item.expertise&&item.expertise}</h1>
 <button onClick={(e)=>nominate(e,item._id,item.name,item.expertise)}>Nominate</button>

 </>
 )
})
}


console.log("groupData",groupData)

  return (
    <section>
    {loading&&<><h1>Expert Advisers/Leaders</h1>
  {leadersmapped}
      <h2>Candidates</h2>
      <button onClick={(e)=>toggleViewCandidatesFunction(e)}>See nominated candidates</button>
  {toggleViewCandidates&&candidatesmapped}
      <h2>Nominate a group member as a candidate</h2>

  <button onClick={(e)=>toggleNominationsFunction(e)}>Nominate a member for leadership</button>

    {toggleNominations&&<h3>There are no particular election events on Democracy Book. Members can nominate and/or vote for any other
    member at any time. If one member becomes more popular than another they can become leader at any time.The
    elected leaders are servants of the people they represent, if they do not lead the group in a direction that
    is in the best interests of the group, the group can take away authority at any time. Every day, the list of
    nominated candidates is shuffled and then sorted in order from highest to lowest number of votes
    candidates with equal numbers of votes will be ordered randomly. This may mean that if many people have equal numbers
    of votes, each time they refresh the page, they may or may not be a leader. All of this is designed to make leaders feel
    as insecure as possible, to force them to consult with and make the people they represent feel as comfortable as possible
    with them being in charge. You must earn people's respect, you are not entitled to it. Power, in the sense of being able to
    impose your will onto others, is never legitimate. Authority should be grounded in knowledge, wisdom and moral integrity,
    not coercive force. Also, being removed from leadership does not necessarily reflect poorly on you as a person or your
    overall character, your life circumstances may restrit your ability to perform the job effectively. It may not be your
    fault, but the group still needs to have the most capable leaders. We think you are smart enough to understand the common
    sense idea that experts often have valuable advice for us that we should take voluntarily. </h3>}
      {toggleNominations&&membersmapped}</>
    }


    </section>
  )}
