import React, {useRef, useState, useEffect} from 'react'
import Expertfeed from './../post/Expertfeed'
import auth from './../auth/auth-helper'



export default function ExpertComponent(props) {
const nameValue = React.useRef('')
const workExperienceValue = React.useRef('')
const qualificationsValue = React.useRef('')
const [candidates, setCandidates] = useState([]);
const [members, setMembers] = useState([]);
const [groupData, setGroupData] = useState([]);
const [emails, setEmails] = useState([]);
const [timer, setTimer] = useState();
const [timeNow, setTimeNow] = useState(new Date);
const [secondNotificationSent, setSecondNotificationSent] = useState(new Date);


useEffect(() => {
fetchCandidateData()
checkTime()
fetchGroupData()

},[])

useEffect(() => {
  if(timer && timeNow){


if(groupData.havingelection===true){
  console.log(groupData.havingelection)

      console.log("timers")

      var electionstarttime=Date.parse(timer)/(1000*60*60*24)
      var timeatthemoment=Date.parse(timeNow)/(1000*60*60*24)

      console.log(electionstarttime)
      console.log(timeatthemoment)
      console.log(timeatthemoment-electionstarttime)

    if((timeatthemoment-electionstarttime)>=0.005){
      setTimeNow(new Date)
      setTimer(new Date)
      checkWinner()
clearCandidates()

      getEmails()

console.log("emails")
    console.log(emails)

      var groupDataCopy=JSON.parse(JSON.stringify(groupData))
      groupDataCopy['havingelection']= false;
        groupDataCopy['secondelectionnotification']= false;
setGroupData(groupDataCopy)

      electionEnd()
      sendEmails3()

    }
    // if((timeatthemoment-electionstarttime)>0.1 &&(timeatthemoment-electionstarttime)<0.2 ){
    //   getEmails()
    //
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //   console.log("second notification sent")
    //
    //   var groupDataCopy=JSON.parse(JSON.stringify(groupData))
    //   groupDataCopy['secondnotification']= true;
    //   setGroupData(groupDataCopy)
    //   console.log("group data")
    //   console.log(groupData)
    //   secondNotification()
    //     sendEmails2()
    // }
  }}

})

useEffect(() => {



if(candidates.length>=6){
  if(groupData.havingelection===false){

    getEmails()

console.log("starting election")
console.log("starting election")

console.log("starting election")

    var groupDataCopy=JSON.parse(JSON.stringify(groupData))
    groupDataCopy['electionstart']= new Date;
    groupDataCopy['havingelection']= true;
    setGroupData(groupDataCopy)
    console.log("group data inside check candidates length")
    console.log(groupData)
    console.log(groupDataCopy)
    sendEmails()
    setTime()



  }}

},[groupData]);



useEffect(() => {

  members.forEach(item=>{
    if(item.name==nameValue.current.value){
      createCandidate(item._id)
    }
  })

},[members]);


useEffect(() => {

  fetchGroupData()

},[candidates]);

function getEmails(){
var email=members.map(item=>{
  return item.email
})
setEmails(email)
}


function checkWinner(){
var sortedcandidates=candidates.sort((a, b) => (a.votes.length > b.votes.length) ? 1 : -1)
var sortedcandidatestop3=sortedcandidates.slice(0,3)
console.log("sorted candidates")
console.log(sortedcandidatestop3)
var expertuserids=sortedcandidatestop3.map(item=>{return item.userId})
console.log("expert user ids")
console.log(expertuserids)
setExpertWinners()

async function setExpertWinners(){
  const options= {
      method: "PUT",
      body: JSON.stringify(expertuserids),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   await fetch("http://localhost:3000/experts/expertwinners/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))

}
}

function clearCandidates(){
  console.log("clearing candidates")
  setCandidates([])

  const options= {
      method: "DELETE",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   fetch("http://localhost:3000/experts/clearcandidates/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))


}


function sendEmails(){
  console.log("send emails")
  console.log(emails)
if(emails.length>0){
  const options= {
      method: "POST",
      body: JSON.stringify(emails),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   fetch("http://localhost:3000/experts/sendelectionnotification/"+ props.groupName +"/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))


}}


function sendEmails2(){
  console.log("send emails")
  console.log(emails)
if(emails.length>0){
  const options= {
      method: "POST",
      body: JSON.stringify(emails),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   fetch("http://localhost:3000/experts/sendelectionnotification2/"+ props.groupName +"/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))


}}

function sendEmails3(){
  console.log("send emails")
  console.log(emails)
if(emails.length>0){
  const options= {
      method: "POST",
      body: JSON.stringify(emails),
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   fetch("http://localhost:3000/experts/sendelectionnotification3/"+ props.groupName +"/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))


}}




async function setTime(){
  const options= {
      method: "PUT",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   await fetch("http://localhost:3000/experts/havingelection/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))

}

async function electionEnd(){
  const options= {
      method: "PUT",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   await fetch("http://localhost:3000/experts/electionend/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))

}

async function secondNotification(){
  const options= {
      method: "PUT",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

   await fetch("http://localhost:3000/experts/secondelectionnotification/" + props.groupId, options)
              .then(response => response.json()).then(json => console.log(json))
}

async function checkTime(){
var datenow=new Date
   await fetch("http://localhost:3000/groups/checktime/" + props.groupId)
   .then(result => result.json())
   .then(response => {
       setTimer(response.electionstart)
       setTimeNow(datenow)
   }).catch(err=>console.log(err))
}


function createCandidate(userId){

  const newCandidate= {
    name: nameValue.current.value,
    workexperience:workExperienceValue.current.value,
    qualifications:qualificationsValue.current.value,
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

                  await  fetch("http://localhost:3000/experts/addCandidate/", options)
                            .then(response => response.json()).then(json => console.log(json))
                  await fetchCandidateData()
              }

  fetchdata()
}







function fetchCandidateData(){
  fetch("http://localhost:3000/experts/findcandidates/"+props.groupId)
      .then(result => result.json())
      .then(response => {
          setCandidates(response.data)
      }).catch(err=>console.log(err))
}

function handleSubmit(e) {
e.preventDefault()
checkTime()
fetchMembers()


}

function fetchMembers(){
   fetch("http://localhost:3000/experts/getmembers/"+props.groupId)
   .then(result => result.json())
   .then(response =>
       setMembers(response.data.members)
   ).catch(err=>console.log(err))
}

async function fetchGroupData(){

await fetch("http://localhost:3000/experts/getgroupdata/"+props.groupId)
.then(result => result.json())
.then(response =>
    setGroupData(response.data)
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

        await fetch("http://localhost:3000/experts/approveofcandidate/" + id +"/"+ auth.isAuthenticated().user._id, options
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

        await fetch("http://localhost:3000/experts/withdrawapprovalofcandidate/" + id +"/"+ auth.isAuthenticated().user._id, options
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
console.log("experts")
  console.log(groupData)
if(groupData.experts){
  console.log(groupData.experts)
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
console.log("experts in top level")
console.log(groupData.experts)

  return (
    <section>
    <h2>Expert Advisers</h2>
    {expertsmapped}
    <h1>Candidates</h1>
    {candidatesmapped}
      <Expertfeed groupId={props.groupId} experts={groupData.experts}/>
    <button onClick={clearCandidates}>clear candidates</button>
    <h1>Any member can nominate a candidate the group to approve before they can run in the next election. Experts can't actually
    make the group do anything, unless the members delegate them the authority to make decisions about certain things. Experts also
    control the advice feed at the top of the group page.</h1>
      <form onSubmit={handleSubmit}>
        <div >
        <label>Name</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={nameValue}

        />
        <label> Qualifications</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={qualificationsValue}

        />
        <label>Work Experience Value</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={workExperienceValue}

        />


          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
  )}
