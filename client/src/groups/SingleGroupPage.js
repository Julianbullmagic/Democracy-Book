import React, { Component } from 'react';
// import { Redirect } from 'react-router';
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import NewRuleForm from './newRuleForm'
import ExpertComponent from './ExpertComponent'
import Kmeans from 'node-kmeans';
const KmeansLib = require('kmeans-same-size');
const kmeans = require('node-kmeans');



class SingleGroupPage extends Component {

    constructor(props) {
           super(props);

           this.state = {
             id:"",
             title: "",
             description: "",
             centroid:"",
             rules: [],
             members: [],
             redirect: false,
             updating:false
           }

           fetch('populatemembers/'+this.props.match.params.groupId).then(res => {
             return res.json();

           }).then(blob => {
             console.log("blob")
        console.log(blob['data'][0])

             this.setState({id:this.props.match.params.groupId})
       this.setState({title:blob['data'][0]['title']});
       this.setState({description:blob['data'][0]['description']});
       this.setState({rules: blob['data'][0]['rules']});
       this.setState({centroid: blob['data'][0]['centroid']});
       this.setState({members: blob['data'][0]['members']});
       if(blob['data'][0]['members']['length']>4){
         console.log("members")
console.log(this.state.members)
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
        console.log(newGroup)
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
           console.log("info",info);
           var data=info

           var kmeans = new KmeansLib();
           const k = 2; // Groups Number
           const size = 4 // Group size

           kmeans.init({k: k, runs: size, equalSize: true, normalize: false });

           let vectors = new Array();
       for (let i = 0 ; i < data.length ; i++) {

         vectors[i] = {x:data[i]['coordinates'][0] , y:data[i]['coordinates'][1]};
       }

           const sum = kmeans.calc(vectors);

       let group1=[]
       let group2=[]
       for (let i = 0 ; i < data.length ; i++) {

          if (data[i]['coordinates'][0]===vectors[i]['x']&&
          data[i]['coordinates'][1]===vectors[i]['y']&&
          vectors[i]['k']===1
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
            <ExpertComponent groupId={this.props.match.params.groupId} members={this.state.members} groupName={this.state.title}/>
            <button onClick={(e)=>this.join(e)}>Join Group?</button>

            <p>Description: <strong> {this.state.description}</strong> </p>
            <p>Group Rules: <strong>   {rulescomponent} </strong></p>
              {this.state.id && <Newsfeed groupId={this.state.id}/>}

          </div>



         </section>

      </React.Fragment>
    );
  }
}

export default SingleGroupPage;
