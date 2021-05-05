import React, { Component } from 'react';
import {Link} from "react-router-dom";

import auth from './../auth/auth-helper'

class ItemList extends Component {


  constructor(props) {
         super(props);
         this.state = {
           items: [],
           imageIndex:0
         }
         fetch("https://democracybook.herokuapp.com/marketplace/").then(res => {
           return res.json();
         }).then(blob => {
           this.setState({items: blob.data})


         })
     }




  render() {
    console.log("items")
console.log(this.state.items)
    return (
      <React.Fragment>
        <header>
          <h1>Listings</h1>
        </header>
        <section>
          <div >
            {this.state.items.map(item => {


              return(
                <>
                <div key={item._id}>
          <Link exact to={"groups/" + item._id}>
                    <div>
                     <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p>{item.labourtime}</p>
                    <p>{item.priceorrate}</p>

                    </div></Link>
                </div>
                </>
              )
            })}
          </div>
        </section>

      </React.Fragment>
    );
  }
}

export default ItemList;
