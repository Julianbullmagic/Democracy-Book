import React, { Component } from 'react';
import {Link} from "react-router-dom";

import auth from './../auth/auth-helper'

class Chat extends Component {

//auth.isAuthenticated().user._id
  constructor(props) {
         super(props);
         this.state = {
           group:{}
         }
         fetch("https://democracybook.herokuapp.com/groups/"+props.groupId).then(res => {
           return res.json();
         }).then(blob => {
           this.setState({items: blob.data})


         })
     }




  render() {
    console.log("group in chat")
console.log(this.state.group)
    return (
      <React.Fragment>

      <div className="chat-container">
        <header className="chat-header">
          <h1><i className="fas fa-smile"></i> ChatCord</h1>
          <a href="index.html" className="btn">Leave Room</a>
        </header>
        <main className="chat-main">
          <div className="chat-sidebar">
            <h3><i className="fas fa-comments"></i> Room Name:</h3>
            <h2 id="room-name"></h2>
            <h3><i className="fas fa-users"></i> Users</h3>
            <ul id="users"></ul>
          </div>
          <div className="chat-messages"></div>
        </main>
        <div className="chat-form-container">
          <form id="chat-form">
            <input
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autocomplete="off"
            />
            <button className="btn"><i className="fas fa-paper-plane"></i> Send</button>
          </form>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

export default Chat;
