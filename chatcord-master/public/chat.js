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

      <div class="chat-container">
        <header class="chat-header">
          <h1><i class="fas fa-smile"></i> ChatCord</h1>
          <a href="index.html" class="btn">Leave Room</a>
        </header>
        <main class="chat-main">
          <div class="chat-sidebar">
            <h3><i class="fas fa-comments"></i> Room Name:</h3>
            <h2 id="room-name"></h2>
            <h3><i class="fas fa-users"></i> Users</h3>
            <ul id="users"></ul>
          </div>
          <div class="chat-messages"></div>
        </main>
        <div class="chat-form-container">
          <form id="chat-form">
            <input
              id="msg"
              type="text"
              placeholder="Enter Message"
              required
              autocomplete="off"
            />
            <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
          </form>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

export default Chat;
