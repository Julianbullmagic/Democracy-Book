import React, { Component } from 'react';
import {Link} from "react-router-dom";

import auth from './../auth/auth-helper'

class GroupsList extends Component {


  constructor(props) {
         super(props);
         var uri
         if(process.env.NODE_ENV === 'production') {
        uri="https://democracybook.herokuapp.com"
       }else{
         uri="https://localhost:5000"
       }

         this.state = {
           items: [],
           imageIndex:0,
           uri:uri
         }
         console.log("state")
console.log(this.state)
         fetch(`/groups/findgroups`).then(res => {
            return res.json();
          }).then(blob => {
            this.setState({items: blob.data})


          })


     }




  render() {

    var groupsmapped=<h3>no groups</h3>

if(this.state.items){groupsmapped=this.state.items.map(item => {


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
          {groupsmapped}
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default GroupsList;
