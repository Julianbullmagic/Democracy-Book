import React, {useRef, useState, useEffect} from 'react'
import Expertfeed from './../post/Expertfeed'
import auth from './../auth/auth-helper'



export default function ExpertComponent(props) {
const nameValue = React.useRef('')
const [candidates, setCandidates] = useState([]);
const [groupData, setGroupData] = useState([]);
const [members,setGroupMembers]=useState([props.members])



useEffect(() => {
fetchGroupData()
fetchCandidateData()
checkWinner()
console.log("members")
console.log(props.members)
console.log(members)
},[])




function checkWinner(){
var sortedcandidates=candidates.sort((a, b) => (a.votes.length > b.votes.length) ? 1 : -1)
var sortedcandidatestop3=sortedcandidates.slice(0,3)

var expertuserids=sortedcandidatestop3.map(item=>{return item.userId})

setExpertWinners()

async function setExpertWinners(){
  const options= {
      method: "PUT",
      body: JSON.stringify(expertuserids),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   await fetch("groups/expertwinners/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))

}
}

//
// function sendEmails(){
//
// if(emails.length>0){
//   const options= {
//       method: "POST",
//       body: JSON.stringify(emails),
//       headers: {
//           "Content-type": "application/json; charset=UTF-8"}}
//
//    fetch("experts/sendelectionnotification/"+ props.groupName +"/" + props.groupId, options)
//               .then(response => response.json()).then(json => console.log(json))
//
//
// }}



//
// async function checkTime(){
// var datenow=new Date
//    await fetch("groups/checktime/" + props.groupId)
//    .then(result => result.json())
//    .then(response => {
//        setTimer(response.electionstart)
//        setTimeNow(datenow)
//    }).catch(err=>console.log(err))
// }


function createCandidate(userId){

  const newCandidate= {
    name: nameValue.current.value,
    groupId:props.groupId,
    userId:userId,
    votes:[auth.isAuthenticated().user._id]
  }

              async function fetchdata(){

                const options= {
                    method: "POST",
                    body: JSON.stringify(newCandidate),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"}}

                  await  fetch("groups/addCandidate/", options)
                            .then(response => response.json()).then(json => console.log(json))
                  await fetchCandidateData()
              }

  fetchdata()
}







function fetchCandidateData(){
  fetch("groups/findcandidates/"+props.groupId)
      .then(result => result.json())
      .then(response => {
          setCandidates(response.data)
      }).catch(err=>console.log(err))
}

function handleSubmit(e) {


}


async function fetchGroupData(){

await fetch("groups/getgroupdata/"+props.groupId)
.then(result => result.json())
.then(response =>{
  console.log("response",response.data)
    setGroupData(response.data)}
).catch(err=>console.log(err))
}


      function approve(e,id){
        console.log(id)
   async function giveapproval(){
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

        await fetch("groups/approveofcandidate/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}
giveapproval()
fetchCandidateData()
}




      function withdrawapproval(e,id){
console.log(id)
         async function takeapproval(){
           const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

        await fetch("groups/withdrawapprovalofcandidate/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}
takeapproval()
fetchCandidateData()
}




      function nominate(e,id){
console.log(id)
         async function takeapproval(){
           const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

        await fetch("groups/withdrawapprovalofcandidate/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

}
takeapproval()
fetchCandidateData()
}




var expertsmapped= <h3>No Experts Yet, nominate some candidates</h3>

if(groupData.experts){
expertsmapped=groupData.experts.map(item=>{
  return(
    <>
    <h3>{item.name}</h3>
<p>{item.about}</p>


</>
)
})
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
   approval=<h5>{votes.length} member approves of this Nominee</h5>
   }
   if(votes.length>1){
   approval=<h5>{votes.length} members approve of this Nominee</h5>
 }}

 return(
   <>
   <h3>{item.name}</h3>
<p>{item.qualifications}</p>
<p>{item.workexperience}</p>
<button onClick={(e)=>approve(e,item._id)}>Approve of Candidate?</button>
<button onClick={(e)=>withdrawapproval(e,item._id)}>Remove Approval?</button>
{approval}

</>
)})}


var membersmapped=<h3>No Members</h3>

 if(members){
   console.log("members below",members)
   console.log("groupdata",groupData)

 var membersmapped=members.map(item => {
   return(
     <>
     <h3>{item.name}</h3>
 <button onClick={(e)=>nominate(e,item._id)}>Nominate</button>

 </>
 )
})
console.log(membersmapped)
}


console.log("groupdata",groupData)
console.log("members",members)




  return (
    <section>
    <h1>Expert Advisers</h1>
    {expertsmapped}
    <h2>Candidates</h2>
    {candidatesmapped}
      {<Expertfeed groupId={props.groupId} experts={groupData.experts}/>}
    <h2>Nominate a group member as a candidate</h2>
    <h3>There are no particular election events on Democracy Book. Members can nominate and/or vote for any other
    member at any time. If one member becomes more popular than another they can become leader at any time.The
    elected leaders are servants of the people they represent, if they do not lead the group in a direction that
    is in the best interests of the group, the group can take away authority at any time. There must always be
    two female and two male leaders in all groups.</h3>

  {membersmapped}

    </section>
  )}
