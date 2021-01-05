import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Chat from './chat'
import auth from './../auth/auth-helper'

class ChatComponent extends Component {

//auth.isAuthenticated().user._id
  constructor(props) {
         super(props);


         this.state = {
           groups: [],
         }


           fetch("https://democracybook.herokuapp.com/groups/findgroups/").then(res => {
             return res.json();
           }).then(info=>{console.log(info)})



     }



  render() {
    console.log("groups in chat")

console.log(this.state)


    return (
      <React.Fragment>
      <div className="join-container">
        <header className="join-header">
          <h1><i className="fas fa-smile"></i> Chat</h1>
        </header>
        <main className="join-main">
          <form >

            <div className="form-control">
              <label htmlFor="groups">groups</label>
              <select name="room" id="room">

              </select>
            </div>
            <button type="submit" class="btn">Join Chat</button>
          </form>
        </main>
      </div>
      </React.Fragment>
    );
  }
}

export default ChatComponent;
