import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { MapContainer, TileLayer,Circle} from 'react-leaflet'
import SingleMarketPlaceItem from './SingleMarketplaceItem'
import CreateItemForm from './CreateItemForm'
import auth from './../auth/auth-helper'

class SingleMarketPlaceShop extends Component {


    // const [viewForm, setViewForm]=useState(false)
    // const [viewShopForm, setViewShopForm]=useState(false)
    // const [viewInfo, setViewInfo]=useState(false)
    // const [itemSearchVal, setItemSearchVal]=useState('')



  constructor(props) {
         super(props);
console.log(props)
         this.state = {
          items:[],
          toggleForm:false,
         }


           }





handleClick(){
this.setState({toggleForm:!this.state.toggleForm})
}

  render() {




    return (
      <>
      <button  onClick={()=>{this.handleClick()}}>Create Cooperative?</button>
      {this.state.toggleForm && <CreateItemForm cooperativeId={this.props.cooperativeId}/>}      </>

    )
  }
}

export default SingleMarketPlaceShop;
