import React, { Component } from 'react';
import { Redirect } from 'react-router';
import auth from './../auth/auth-helper'
import Newsfeed from './../post/Newsfeed'
import NewRuleForm from './newRuleForm'
import ExpertComponent from './ExpertComponent'



class SingleGroupPage extends Component {

    constructor(props) {
           super(props);
           this.state = {
             id:"",
             title: "",
             description: "",
             rules: [],
             members: [],
             redirect: false,
             updating:false
           }

           fetch("http://localhost:3000/groups/" + this.props.match.params.groupId).then(res => {
             return res.json();
           }).then(blob => {
             this.setState({id:this.props.match.params.groupId})
       this.setState({title: blob.title});
       this.setState({description: blob.description});
       this.setState({rules: blob.rules});
       this.setState({members: blob.members});
           })
       }






       disapprove(e,id){

         const options = {
           method: 'put',
           headers: {
             'Content-Type': 'application/json'
           },
              body: ''
         }

         fetch("http://localhost:3000/groups/disapprove/" + id +"/"+ auth.isAuthenticated().user._id, options
).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("http://localhost:3000/groups/" + this.props.match.params.groupId).then(res => {
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
  fetch("http://localhost:3000/groups/" + this.props.match.params.groupId).then(res => {
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

         fetch("http://localhost:3000/groups/withdrawdisapproval/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("http://localhost:3000/groups/" + this.props.match.params.groupId).then(res => {
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

         fetch("http://localhost:3000/groups/join/"+this.props.match.params.groupId+"/"+ auth.isAuthenticated().user._id, options
)  .then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  })
  fetch("http://localhost:3000/groups/" + this.props.match.params.groupId).then(res => {
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
            <p>Group Rules: <strong>   {this.state.rules.map(item => {

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
              <NewRuleForm ruleId={item._id} rule={item} members={this.state.members} groupId={this.props.match.params.groupId}/></>
                     :<p>''</p>

                   }

                      </div>
                      <br/>
                  </div>
                )
              })}</strong></p>
              {this.state.id&&<Newsfeed groupId={this.state.id}/>}

          </div>



         </section>

      </React.Fragment>
    );
  }
}

export default SingleGroupPage;
