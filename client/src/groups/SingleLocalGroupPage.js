import React, { Component } from 'react';
// import { Redirect } from 'react-router';
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import NewRuleForm from './newRuleForm'
import LocalGroupExpertComponent from './LocalGroupExpertComponent'
import Kmeans from 'node-kmeans';
const KmeansLib = require('kmeans-same-size');
const kmeans = require('node-kmeans');



class SingleLocalGroupPage extends Component {

    constructor(props) {
           super(props);

           this.state = {
            location:"",
             centroid:"",
             members:[],
             leaders:[],
             candidates:[],
             groupData:{},
             id:'',
             rules: [],
             redirect: false,
             updating:false
           }


  this.updateLeaders= this.updateLeaders.bind(this)

    }


updateLeaders(leaders){this.setState({ leaders: leaders })}


componentDidMount(){

             fetch('populatemembers/'+this.props.match.params.groupId).then(res => {
               return res.json();

             }).then(blob => {
               console.log("blob",blob)
                 this.setState({groupData:blob['data'][0],members: blob['data'][0]['members'],
                 id:this.props.match.params.groupId,location:blob['data'][0]['location'],
               leaders:blob['data'][0]['leaders'],rules: blob['data'][0]['rules'],
             centroid: blob['data'][0]['centroid'],members: blob['data'][0]['members']})

          if(blob['data'][0]['members']['length']>=16){

          this.splitGroupMembers(this.state.members)
          }



        })
}


newSplitGroups(groupIds,centroid){

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${centroid[0]},${centroid[1]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                  .then(response => response.json())
                    .then(data => this.postSplitGroup(data["features"][2]["place_name"],centroid,groupIds))
}


postSplitGroup(placename,centroid,groupIds){
  var newGroup={
    title: this.state.title,
    location:placename,
    description: this.state.description,
    members:[...groupIds],
    centroid:centroid,
    rules:this.state.rules}
        const options={
            method: "POST",
            body: JSON.stringify(newGroup),
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}

                fetch("splitgroup/", options)
                        .then(response => response.json()).then(json => console.log(json));

}

newHigherLevelGroup(groupIds,centroid){

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${centroid[0]},${centroid[1]}.json?access_token=pk.eyJ1IjoianVsaWFuYnVsbCIsImEiOiJja25zbXJibW0wNHgwMnZsaHJoaDV6MTg4In0.qPBGW4XMJcsZSUCrQej8Zw`)
                  .then(response => response.json())
                    .then(data => this.postHigherLevelGroup(data["features"][2]["place_name"],centroid,groupIds))
}


getRandomMembers(arr, n){
    var result = new Array(4),
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

postHigherLevelGroup(placename,centroid){

  var groupmembers=JSON.parse(JSON.stringify(this.state.members))
  console.log("groupmembers",groupmembers)
  var randomsampleofmembers=this.getRandomMembers(groupmembers, 4)
  console.log("randomsampleofmembers",randomsampleofmembers)

  var newmembersarray=[...randomsampleofmembers,...this.state.leaders]

  var newGroup={
    title: this.state.title,
    location:placename,
    description: this.state.description,
    members:randomsampleofmembers,
    allmembers:[...this.state.members],
    centroid:centroid,
    rules:this.state.rules}
        const options={
            method: "POST",
            body: JSON.stringify(newGroup),
            headers: {
                "Content-type": "application/json; charset=UTF-8"}}

                fetch("splitgroup/", options)
                        .then(response => response.json()).then(json => console.log(json));

}



deleteGroup(){
  const options={
      method: "DELETE",
      body: '',
      headers: {
          "Content-type": "application/json; charset=UTF-8"}}

  fetch("deletegroup/"+this.state.id, options)
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

splitGroupMembers(info){
           var data=info

           var kmeans = new KmeansLib();
           const k = 2; // Groups Number
           const size = 8 // Group size

           kmeans.init({k: k, runs: size, equalSize: true, normalize: false });

           let vectors = new Array();
       for (let i = 0 ; i < data.length ; i++) {

         vectors[i] = {x:data[i]['coordinates'][0] , y:data[i]['coordinates'][1]};
       }

           const sum = kmeans.calc(vectors);

       let group1=[]
       let group2=[]
       for (let i = 0 ; i < data.length ; i++) {

          if (data[i]['coordinates'][0]==vectors[i]['x']&&
          data[i]['coordinates'][1]==vectors[i]['y']&&
          vectors[i]['k']==1
        ){
          group1.push(data[i])
        }else{
          group2.push(data[i])
        }


       }

var centroidGroup1=this.findCentroid(group1)
var centroidGroup2=this.findCentroid(group2)


var group1Ids=group1.map(item=>item._id)
var group2Ids=group2.map(item=>item._id)

this.newSplitGroups(group1Ids,centroidGroup1)
this.newSplitGroups(group2Ids,centroidGroup2)
this.newHigherLevelGroup(this.state.members,this.state.centroid)
this.deleteGroup()
         }




       disapprove(e,id){

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("disapprove/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("groups/" + this.props.match.params.groupId).then(res => {
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

         fetch("withdrawdisapproval/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("groups/" + this.props.match.params.groupId).then(res => {
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
         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("join/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
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


    return (
      <React.Fragment>
          <section >
<br/>
<br/>

          <h2>Group Details</h2>



          <div >

            <p>Group Title: <strong> {this.state.title}</strong></p>
            {this.state.members&&this.state.groupData&&<LocalGroupExpertComponent groupId={this.props.match.params.groupId}
            groupData={this.state.groupData}
            members={this.state.members}
            updateLeaders={this.updateLeaders}
            />}
            <button onClick={(e)=>this.join(e)}>Join Group?</button>

            <p>Description: <strong> {this.state.description}</strong> </p>
            <p>Group Rules: <strong>   {rulescomponent} </strong></p>
              {this.state.id&&this.state.leaders&& <Newsfeed groupId={this.state.id} leaders={this.state.leaders}/>}

          </div>



         </section>

      </React.Fragment>
    );
  }
}

export default SingleLocalGroupPage;
