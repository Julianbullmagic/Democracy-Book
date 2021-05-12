import React, { Component } from 'react';
// import { Redirect } from 'react-router';
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import NewRuleForm from './newRuleForm'
import ExpertComponent from './LocalGroupExpertComponent'
import Kmeans from 'node-kmeans';
const KmeansLib = require('kmeans-same-size');
const kmeans = require('node-kmeans');
const mongoose = require("mongoose");
const geolib = require('geolib');
var geocluster = require("geocluster");






class SingleGroupPage extends Component {

    constructor(props) {
           super(props);
           this.state = {
            location:"",
            grouptype:props.match.params.grouptype,
             centroid:"",
             members:[],
             radius:0,
             leaders:[],
             candidates:[],
             higherlevelgroup:'',
             groupData:{},
             newLowerGroupIds:[],
             id:'',
             rules: [],
             redirect: false,
             updating:false
           }


  this.updateLeaders= this.updateLeaders.bind(this)

    }


updateLeaders(leaders){this.setState({ leaders: leaders })}



componentDidMount(){

             fetch("/"+this.state.grouptype+'/populatemembers/'+this.props.match.params.groupId).then(res => {
               return res.json();

             }).then(blob => {
               console.log("blob in single group page",blob)


var memberscopy=[...blob['data'][0]['members']]
var distancesArray=[]
for (var i = 0; i < memberscopy.length; i++){
  for (var y = 0; y < memberscopy.length; y++){
    console.log(memberscopy[i]['coordinates'][1], memberscopy[i]['coordinates'][0],
    memberscopy[y]['coordinates'][1], memberscopy[y]['coordinates'][0])

     var distance=geolib.getDistance({latitude:memberscopy[i]['coordinates'][1], longitude:memberscopy[i]['coordinates'][0]},
     {latitude:memberscopy[y]['coordinates'][1], longitude:memberscopy[y]['coordinates'][0]})

  distancesArray.push(distance)
}
}
distancesArray.sort(function(a, b){return b-a});


this.postRadius(blob['data'][0]['_id'],distancesArray[0])

console.log("LEADERS ABOVE",blob['data'][0]['leaders'])


          this.setState({groupData:blob['data'][0],members: blob['data'][0]['members'],
          id:this.props.match.params.groupId,location:blob['data'][0]['location'],
          higherlevelgroup:blob['data'][0]['higherlevelgroup'],
        leaders:blob['data'][0]['leaders'],rules: blob['data'][0]['rules'],
       centroid: blob['data'][0]['centroid'],members: blob['data'][0]['members']})

       if(blob['data'][0]['members']['length']>=8&&blob['data'][0]['higherlevelgroup']){
       this.splitGroupMembers(blob['data'][0]['members'],blob['data'][0]['higherlevelgroup'])

       }
       if(blob['data'][0]['members']['length']>=8){
       this.splitGroupMembers(blob['data'][0]['members'])

       }
        })




}



newSplitGroups(groupIds,centroid,newId,newhigherid){
console.log("centroid in new split groups",centroid)
fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${centroid[1]},${centroid[0]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                  .then(response => response.json())
                    .then(data => {this.postSplitGroup(data["features"][2]["place_name"],centroid,groupIds,newId,newhigherid)})
}

postRadius(groupId,radius){

        const options={
            method: "PUT",
            body: '',
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}

                fetch("/"+this.state.grouptype+"/updateradius/"+groupId+"/"+radius, options)
                        .then(response => response.json()).then(json => console.log(json));


      this.setState({radius:radius})

}

postSplitGroup(placename,centroid,groupIds,newId,newhigherid){

  var newGroup={
    _id:newId,
    title: this.state.title,
    location:placename,
    description: this.state.description,
    lastcandidateshuffle:new Date().setHours(0,0,0,0),
      higherlevelgroup:newhigherid,
    members:[...groupIds],
    centroid:centroid,
    rules:this.state.rules}
    console.log("new group",newGroup)

        const options={
            method: "POST",
            body: JSON.stringify(newGroup),
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}

             fetch("/"+this.state.grouptype+"/newlowerlevelgroup/", options)
                        .then(response => response.json()).then(json => console.log(json));


                        const options2={
                            method: "PUT",
                            body: JSON.stringify(groupIds),
                            headers: {
                                "Content-type": "application/json; charset=UTF-8"}}

             fetch("/"+this.state.grouptype+"/assignnewlowerlevelgroup/"+newGroup._id, options2)
                        .then(response => response.json()).then(json => console.log(json));



}



newHigherLevelGroup(centroid,newId,lowergroupids){
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${centroid[1]},${centroid[0]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                  .then(response => response.json())
                    .then(data => {
                      console.log("placename",data.features[2])
                      this.postHigherLevelGroup(data["features"][2]["place_name"],centroid,newId,lowergroupids)
})}


getRandomMembers(arr, n){
    var result = new Array(2),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

async postHigherLevelGroup(placename,centroid,newId,lowergroupids){

console.log("placename,centroid,newId,lowergroupids",placename,centroid,newId,lowergroupids)


  var groupmembers=JSON.parse(JSON.stringify(this.state.members))
  var groupleaders=JSON.parse(JSON.stringify(this.state.leaders))
  console.log("leaders",groupleaders)
  var groupleadernames=groupleaders.map(item=>{return item.name})
  var membersofleaders=[]
  for (var member of groupmembers){
    if(groupleadernames.includes(member.name)){
      membersofleaders.push(member)
    }
  }


  var randomsampleofmembers=this.getRandomMembers(groupmembers, 2)
  console.log("new random members",randomsampleofmembers)
  console.log("new leader members",membersofleaders)
  var newmembersarray=[...randomsampleofmembers,...membersofleaders]
  console.log("new members array!!!!!!!!!!",newmembersarray)
  var newmembersids=newmembersarray.map(item=> item._id)

var memberscopy=JSON.parse(JSON.stringify(this.state.members))
var allmemberids=memberscopy.map(item=>item._id)

  var newGroup={
    _id:newId,
    title: this.state.title,
    location:placename,
    description: this.state.description,
    lastcandidateshuffle:new Date().setHours(0,0,0,0),
    members:newmembersids,
    newLowerGroupIds:lowergroupids,
    allmembers:allmemberids,
    centroid:centroid,
    rules:this.state.rules}
    console.log("newhighergroup",newGroup)
        const options={
            method: "POST",
            body: JSON.stringify(newGroup),
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}

              await fetch("/"+this.state.grouptype+"/newhigherlevelgroup/", options)
                        .then(response => response.json()).then(json => {
                          for (var member of newmembersids){
                            this.recordWhichMembersJoin(member,newGroup._id)
                          }
                          console.log(json)

                        })

}


changelocalgroupsofmembers(memberid,groupid){

    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
         body: ''
    }




fetch("/"+this.state.grouptype+"/changelocalgroupsofmembers/"+groupid.toString()+"/"+ memberid, options
    ).then(res => {
  res.json()
    }).catch(err => {
    console.log(err);
    })
}

recordWhichMembersJoin(userId,groupId){

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
       body: ''
  }

  fetch("/"+this.state.grouptype+"/joinhigherlevelgroup/"+groupId+"/"+ userId, options
  )  .then(res => {

  console.log("joining higher level group result",res);

  }).catch(err => {
  console.log(err);
  })
}

deleteGroup(){
  const options={
      method: "DELETE",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

  fetch("/"+this.state.grouptype+"/deletegroup/"+this.state.id, options)
          .then(response => response.json()).then(json => console.log(json));
}



findCentroid(group){
  let vectors = new Array();
for (let i = 0 ; i < group.length ; i++) {
vectors[i] = [ group[i]['coordinates'][0] , group[i]['coordinates'][1]];
}

var results=kmeans.clusterize(vectors, {k: 1}, (err,res) => {
if (err)console.error(err);
else return res;
});
return results["groups"][0]["centroid"];
}




splitGroupMembers(info,highergroupid){

console.log("info,highergroupid",info,highergroupid)

  var bias = 2.2;


           var data=info


           let vectors = new Array();
       for (let i = 0 ; i < data.length ; i++) {

         vectors[i] = [data[i]['coordinates'][1] ,data[i]['coordinates'][0]]
       }

       var clusters = geocluster(vectors, bias)



       let groupsarray = new Array()
       let group1={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group2={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group3={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group4={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group5={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group6={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group7={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group8={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group9={array:new Array(),_id:mongoose.Types.ObjectId()}
       let group10={array:new Array(),_id:mongoose.Types.ObjectId()}

       groupsarray.push(group1,group2,group3,group4,group5,group6,group7,group8,group9,group10)

for (var member of data){
       for (let i = 0 ; i < clusters.length ; i++) {


         for (var element of clusters[i]['elements']){
           if (member.coordinates[1]===element[0]&&member.coordinates[0]===element[1]){
             console.log(member)
             groupsarray[i]['array'].push(member)
             groupsarray[i]['centroid']=clusters[i]['centroid']
           }

         }


       }
     }

     for (var group of groupsarray){
       const seen = new Set();

const filteredArr = group.array.filter(el => {
  const duplicate = seen.has(el.name);
  seen.add(el.name);
  return !duplicate;
});
group.array=filteredArr
console.log("group",group)
     }



(async () => {

var newgroupids=[]
var newid=mongoose.Types.ObjectId()

console.log("NEW ID", newid)
  for (var group of groupsarray){
    console.log("NEW ID", newid)
    if (group.array.length>0){
      var groupIds=group.array.map(item=>{return item._id})

      await this.newSplitGroups(groupIds,group.centroid,group._id,newid)

      for (var member of groupIds){
        this.changelocalgroupsofmembers(member,group._id)
        if(member==auth.isAuthenticated().user._id){

          var jwt = JSON.parse(sessionStorage.getItem('jwt'));
jwt.user.localgroup = group._id
sessionStorage.setItem('jwt', JSON.stringify(jwt));        }
      }
      newgroupids.push(group._id)
      console.log("newgroupids",newgroupids)
    }
  }


  if(highergroupid){
    var memberscopy=JSON.parse(JSON.stringify(this.state.members))
console.log("MEMBERS COPY WITH HIGHER GROUP",memberscopy)
    // var ids=memberscopy.map(item=>{return item._id})
    // var data={
    //   newgroupids:newgroupids,
    //   ids:ids
    // }
    // const options = {
    //   method: 'put',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //      body: JSON.stringify(data)
    // }
    //
    // await fetch("/"+this.state.grouptype+"/adddatatohigherlevelgroup/"+highergroupid, options
    // )  .then(res => {
    //
    //
    // }).catch(err => {
    // console.log(err);
    // })

  }else{

    console.log("ids in else statement",newid,newgroupids)
     this.newHigherLevelGroup(this.state.centroid,newid,newgroupids)

  }


  this.props.history.push('/groups');
  this.deleteGroup()
    })()



         }




       disapprove(e,id){

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/disapprove/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("/"+this.state.grouptype+"/" + this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {
    this.setState({id:this.props.match.params.groupId})
 this.setState({title: blob.title});
 this.setState({description: blob.description});
 this.setState({rules: blob.rules});
 this.setState({members: blob.members});
  })
}

updateSuggestions(){
  fetch(this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {
    this.setState({id:this.props.match.params.groupId})
 this.setState({title: blob.title});
 this.setState({description: blob.description});
 this.setState({rules: blob.rules});
 this.setState({members: blob.members});
  })
}



       withdrawdisapproval(e,id){

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/withdrawdisapproval/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("/"+this.state.grouptype+"/groups/" + this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {
    this.setState({id:this.props.match.params.groupId})
this.setState({title: blob.title});
this.setState({description: blob.description});
this.setState({rules: blob.rules});
this.setState({members: blob.members});
  })
       }

       join(e){
         var memberscopy=[...this.state.members]
         memberscopy.push(auth.isAuthenticated().user._id)

         this.setState({members: memberscopy});

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/join/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch(this.props.match.params.groupId).then(res => {
    return res.json();
  }).then(blob => {

this.setState({members: blob.members});
  })


       }

       leave(e){
         var memberscopy=[...this.state.members]
         var filteredarray = memberscopy.filter(function( obj ) {
    return obj._id !== auth.isAuthenticated().user._id;
});
         this.setState({members:filteredarray});

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("/"+this.state.grouptype+"/leave/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })

       }







  render() {
    if(this.state.members.length>2){
      var groupmembers=JSON.parse(JSON.stringify(this.state.members))
      var randomsampleofmembers=this.getRandomMembers(groupmembers, 4)

    }


    var rulescomponent=<h3>no rules</h3>
    if (this.state.members&&this.state.rules&&this.props.match.params.groupId){
      rulescomponent=this.state.rules.map(item => {

        return(

          <div key={item._id}>
          <hr/>
      <h3>{item.name}</h3>
      <button onClick={(e)=>this.disapprove(e,item._id)}>Disapprove?</button>
      <button onClick={(e)=>this.withdrawdisapproval(e,item._id)}>Withdraw Disapproval?</button>


              <div>
               <h4>{item.rule}</h4>
           <h3>number of people who disapprove {item.disagree.length}</h3>
           {(item.disagree.length/this.state.members.length)>=0.05?
             <><p>Some group members are unhappy with this rule, perhaps you can suggest improvements</p>

      <NewRuleForm rule={item} members={this.state.members} groupId={this.props.match.params.groupId}/></>
             :<p>''</p>

           }

              </div>
              <br/>
          </div>
        )
      })}

var joinOrLeave=<><button onClick={(e)=>this.join(e)}>Join Group?</button></>


      var memberids=this.state.members.map(item=>{return item._id})
      if(memberids.includes(auth.isAuthenticated().user._id)){
        joinOrLeave=<><button onClick={(e)=>this.leave(e)}>Leave Group?</button></>
      }

    return (
      <React.Fragment>
          <section >
<br/>
<br/>

          <h2>Group Details</h2>



          <div >

            <p>Group Title: <strong> {this.state.title}</strong></p>
            {this.state.members&&this.state.groupData&&<ExpertComponent groupId={this.props.match.params.groupId}
            groupData={this.state.groupData}
            members={this.state.members}
            updateLeaders={this.updateLeaders}
            grouptype={this.state.grouptype}
            />}
          {joinOrLeave}

            <p>Description: <strong> {this.state.description}</strong> </p>
            <h2>Group Rules: <strong>   {rulescomponent} </strong></h2>
              {this.state.id&&this.state.leaders&& <Newsfeed groupId={this.state.id} leaders={this.state.leaders}/>}

          </div>



         </section>

      </React.Fragment>
    );
  }
}

export default SingleGroupPage;
