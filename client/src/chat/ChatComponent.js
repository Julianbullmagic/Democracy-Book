import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Chat from './chat'
import auth from './../auth/auth-helper'

class ChatComponent extends Component {

//auth.isAuthenticated().user._id
  constructor(props) {
         super(props);
         this.state = {
           groups:[],
           chosengroup:'',
           group:{}
         }

         fetch("https://democracybook.herokuapp.com/groups/findgroups/").then(res => {
           return res.json();
         }).then(info=>{
           console.log(info.data)
           this.setState({groups:info.data})
         })

         this.handleSubmit=this.handleSubmit.bind(this)
         this.handleGroupChange=this.handleGroupChange.bind(this)

     }


     handleGroupChange(event){
       this.setState({chosengroup: event.target.value });
       console.log(this.state.chosengroup)

     }

     handleSubmit(e){
       e.preventDefault()
       fetch("https://democracybook.herokuapp.com/groups/"+this.state.chosengroup).then(res => {
         return res.json();
       }).then(info=>{
         console.log(info)
       })
     }



  render() {
    console.log("groups in chat")
console.log(this.state.groups)
console.log(this.state.chosengroup)

var mappedgroups=  <option value="no groups">no groups</option>
if(this.state.groups){
  mappedgroups=this.state.groups.map(group=>{
    return(
        <option value={group._id}>{group.title}</option>
    )
  })
}

    return (
      <React.Fragment>
      <div className="join-container">
        <header className="join-header">
          <h1><i className="fas fa-smile"></i> ChatCord</h1>
        </header>
        <main className="join-main">
          <form onSubmit={this.handleSubmit}>
            <div className="form-control">
              <label htmlFor="room">Room</label>
              <select name="room" id="room"   onChange={this.handleGroupChange}>
                {mappedgroups}
              </select>
            </div>
            <button type="submit" className="btn">Join Chat</button>
          </form>
          <br/>
          <a href="index.html" className="btn">Leave Room</a>
          <br/>
          <br/>
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

          </main>
</div>


      </React.Fragment>
    );
  }
}

export default ChatComponent;
