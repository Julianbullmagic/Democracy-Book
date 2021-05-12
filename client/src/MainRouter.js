import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import GroupsPage from './groups/GroupsPage'
import Marketplace from './marketplace/Marketplace'
import SingleGroupPage from './groups/SingleGroupPage'

import Menu from './core/Menu'


// Then you can use them like this
// <Route exact path={ routeCodes.ABOUT } component={ About } />
const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/users" component={Users}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/groups" component={GroupsPage}/>
        <Route exact path="/marketplace" component={Marketplace}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route exact path="/user/:userId" component={Profile}/>
        <Route exact path="/groups/:groupId/:grouptype"    component={SingleGroupPage}/>
      </Switch>
    </div>)
}

export default MainRouter
