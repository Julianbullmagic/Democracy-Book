import React, {useState, useEffect} from 'react'
import Expertfeed from './../post/Expertfeed'
import auth from './../auth/auth-helper'

const mongoose = require("mongoose");


export default function ExpertComponent(props) {

const [candidates, setCandidates] = useState([]);
const [leaders, setLeaders] = useState([]);
const [groupData, setGroupData] = useState(props.groupData);
const [toggleNominations, setToggleNominations] = useState(false);
const [toggleViewCandidates, setToggleViewCandidates] = useState(false);
const [members,setMembers]=useState([...props.members])
const [groupId,setGroupId]=useState(props.groupId)









useEffect(() => {
fetchGroupData()
},[])


useEffect(() => {
checkWinner()
checkLastCandidateShuffle()
},[candidates])

useEffect(() => {
updateLeaders()
props.updateLeaders(leaders)
},[leaders])



useEffect(() => {

  checkLastCandidateShuffle()

},[groupData])



function updateLeaders(){
  console.log("leaders in update leaders",leaders)
var leaderids=leaders.map(item=>{return item._id})
console.log("leader ids",leaderids)
   const options = {
     method: 'put',
     headers: {
       'Content-Type': 'application/json'
     },
        body: JSON.stringify(leaderids)
   }

   fetch("/"+props.grouptype+"/updateleaders/"+groupId, options
  ).then(res => {
  console.log(res);
  }).catch(err => {
  console.log(err);
  })
}


function toggleNominationsFunction(){
  setMembers([...props.members])
  setToggleNominations(!toggleNominations)
}


function toggleViewCandidatesFunction(){
  setToggleViewCandidates(!toggleViewCandidates)
}




function checkWinner(){
if (candidates.length>0){
var expertcandidatescopy=JSON.parse(JSON.stringify(candidates))



var sortedcandidates=expertcandidatescopy.sort((a, b) => (a.votes.length < b.votes.length) ? 1 : -1)
var sortedcandidatestop4=sortedcandidates.slice(0,2)
console.log("sortedcandidatestop4",sortedcandidatestop4)
setLeaders(sortedcandidatestop4)
}
}

function shuffleCandidates(){

  var expertcandidatescopy=JSON.parse(JSON.stringify(candidates))
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


function checkLastCandidateShuffle(){

  var timenow=new Date().setHours(0,0,0,0)




if(((timenow-groupData.lastcandidateshuffle)>86400000)&&candidates.length>1){

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body: JSON.stringify(timenow)
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
console.log("fetching group data",groupData)
fetch("/"+props.grouptype+"/populatemembersbelow/"+props.groupId)
.then(result => {return result.json()})
.then(response =>{
    console.log("response.data",response['data'])
    setGroupData(response['data'][0])
    if(response['data'][0]['expertcandidates']){
      console.log("setting candidates")
    setCandidates(response['data'][0]['expertcandidates'])}
    if(response['data'][0]['leaders']){
    console.log("response.data.leaders",response['data'][0]['leaders'])
    setLeaders(response['data'][0]['leaders'])}

var groupDataCopy=JSON.parse(JSON.stringify(response["data"][0]))
var currenttime=new Date().getTime()
for (const candidate of groupDataCopy.expertcandidates){
  const diff=currenttime-candidate.timecreated
if(diff>86400000&&candidate.votes.length<2){
removeCandidate(candidate._id,groupId)
}
}


})}





      function approve(e,candidateId){


var userId=auth.isAuthenticated().user._id

var candidatesCopy=JSON.parse(JSON.stringify(candidates))

        for (const candidate of candidatesCopy) {

          if (candidate._id==candidateId){
          const included=candidate.votes.includes(userId)

          if(!included){
            candidate.votes.push(auth.isAuthenticated().user._id)

            setCandidates({...candidates,candidatesCopy})

          }
        }
      }
      setCandidates(candidatesCopy)


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

var candidatesCopy=JSON.parse(JSON.stringify(candidates))


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
  setCandidates(candidatesCopy)

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

  var justnames=candidates.map(item=>{return item.name})
console.log("candidates",candidates,justnames,groupData,newCandidate)

if(!justnames.includes(newCandidate.name)){


  var candidatesCopy=JSON.parse(JSON.stringify(candidates))
  candidatesCopy.push(newCandidate)
  setCandidates(candidatesCopy)



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






console.log("leaders",leaders)
var leadersmapped= <h3>No Experts Yet, nominate some candidates</h3>

if(leaders){
leadersmapped=leaders.map(item=>{



 return(
   <>
   <h3>{item.name}</h3>
</>
)
}
)
}


var candidatesmapped=<h3>No Candidates</h3>
if(candidates){
candidatesmapped=candidates.map(item => {

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

 if(members){


 membersmapped=members.map(item => {
   return(
     <>
     <h3>{item.name}</h3>
     <h1>Expertise/skills/qualifications/leadership experience :{item.expertise&&item.expertise}</h1>
 <button onClick={(e)=>nominate(e,item._id,item.name,item.expertise)}>Nominate</button>

 </>
 )
})
}


console.log("leaders below",leaders)

  return (
    <section>
    <h1>Expert Advisers/Leaders</h1>
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
    {toggleNominations&&membersmapped}

    </section>
  )}
