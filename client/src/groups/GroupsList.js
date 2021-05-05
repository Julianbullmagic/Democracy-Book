import React, { Component } from 'react';
import {Link} from "react-router-dom";

import auth from './../auth/auth-helper'

class GroupsList extends Component {


  constructor(props) {
         super(props);

         this.state = {
           groups: [],
          localgroup:'',
           imageIndex:0,
         }

         fetch('/groups/findgroups').then(res => {
            return res.json();
          }).then(blob => {
            this.setState({groups: blob.data})
          })
          fetch('/groups/findlocalgroup/'+auth.isAuthenticated().user.localgroup).then(res => {
             return res.json();
           }).then(blob => {
             this.setState({localgroup: blob.data})
             console.log("localgroup",this.state.localgroup)
             console.log("localgroup",auth.isAuthenticated().user.localgroup)

           })


     }




  render() {

    var groupsmapped=<h3>no groups</h3>



if(this.state.groups){groupsmapped=this.state.groups.map(item => {


      return(
        <>
        <div key={item._id}>
<Link exact to={"groups/" + item._id}><h3>{item.name}</h3>
            <div>
             <h3>{item.title}</h3>
            <p>{item.description}</p>
            </div></Link>
        </div>
        </>
      )
    })}

    return (
      <React.Fragment>
        <header>
          <h1>Groups</h1>
        </header>
        <section>
          <div >
          <h2>Local Group</h2>
          <div key={this.state.localgroup._id}>
  <Link exact to={"localgroup/" + this.state.localgroup._id}>
              <div>
               <h3>{this.state.localgroup.location}</h3>
              </div></Link>
          </div>
          <hr/>
          <br/>
          {groupsmapped}
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default GroupsList;
