import React, { Component } from 'react';
import {Link} from "react-router-dom";
import Chat from './chat'
import auth from './../auth/auth-helper'

class ChatComponent extends Component {




  constructor(props) {
         super(props);
         var uri
         if(process.env.NODE_ENV === 'production') {
        uri="https://democracybook.herokuapp.com"
        }else{
         uri="https://localhost:5000"
        }
         this.state = {
           groups:[],
           chosengroup:'',
           group:{},
           uri:uri,
           newmessage:''
         }
         socket = io("https://democracybook.herokuapp.com")

         fetch(`/groups/findgroups`).then(res => {
           return res.json();
         }).then(info=>{
           console.log(info.data)
           this.setState({groups:info.data})
         })

         this.handleSubmit=this.handleSubmit.bind(this)
         this.handleGroupChange=this.handleGroupChange.bind(this)
         this.sendMessage=this.sendMessage.bind(this)
         this.setGroup=this.setGroup.bind(this)
         this.outputUsers=this.outputUsers.bind(this)
         this.outputMessage=this.outputMessage.bind(this)
         this.outputRoomName=this.outputRoomName.bind(this)
     }




     // Get room and users
     socket.on('roomUsers', ({ room, users }) => {
       outputRoomName(room);
       outputUsers(users);
     });

     // Message from server
     socket.on('message', message => {
       console.log(message);
       outputMessage(message);

       // Scroll down
       chatMessages.scrollTop = chatMessages.scrollHeight;
     });

     // Message submit
     chatForm.addEventListener('submit', e => {
       e.preventDefault();

       // Get message text
       let msg = e.target.elements.msg.value;

       msg = msg.trim();

       if (!msg){
         return false;
       }

       // Emit message to server
       socket.emit('chatMessage', msg);

       // Clear input
       e.target.elements.msg.value = '';
       e.target.elements.msg.focus();
     });

     // Output message to DOM
    outputMessage(message) {
       const div = document.createElement('div');
       div.classList.add('message');
       const p = document.createElement('p');
       p.classList.add('meta');
       p.innerText = message.username;
       p.innerHTML += `<span>${message.time}</span>`;
       div.appendChild(p);
       const para = document.createElement('p');
       para.classList.add('text');
       para.innerText = message.text;
       div.appendChild(para);
       document.querySelector('.chat-messages').appendChild(div);
     }

     // Add room name to DOM
    outputRoomName(room) {
       roomName.innerText = room;
     }

     // Add users to DOM
    outputUsers(users) {
       userList.innerHTML = '';
       users.forEach(user=>{
         const li = document.createElement('li');
         li.innerText = user.username;
         userList.appendChild(li);
       });
      }




     handleGroupChange(event){
       this.setState({chosengroup: event.target.value });
       console.log(this.state.chosengroup)

     }

     handleMessageChange(event){
       this.setState({newmessage: event.target.value });
       console.log(this.state.newmessage)

     }
     sendMessage(e){
    socket.emit('message', { auth.isAuthenticated().user.name, this.state.newmessage })
    this.setState({newmessage: ''})
     }

     setGroup(e){
       e.preventDefault()
       socket.emit('joinRoom', { auth.isAuthenticated().user.name, this.state.chosengroup});

     }



  render() {
    console.log("groups in chat")
console.log(this.state.groups)
console.log(this.state.chosengroup)
console.log(this.state.group)


var mappedgroups=  <option value="no groups">no groups</option>
if(this.state.groups){
  mappedgroups=this.state.groups.map(group=>{
    return(
        <option value={group.title}>{group.title}</option>
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
          <form onSubmit={this.setGroup}>
            <div className="form-control">
              <label htmlFor="room">Room</label>
              <select name="room" id="room"   onChange={this.handleGroupChange}>
                {mappedgroups}
              </select>
            </div>
            <button type="submit" className="btn">Join Chat</button>
          </form>
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
                  onChange={this.handleMessageChange}
                />
                <button onClick={this.sendMessage} className="btn"><i className="fas fa-paper-plane"></i> Send</button>
              </form>
            </div>

          </main>
</div>


      </React.Fragment>
    );
  }
}

export default ChatComponent;
