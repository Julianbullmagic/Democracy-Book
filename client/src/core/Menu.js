import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Iconbutton from '@material-ui/core/Iconbutton'
import HomeIcon from '@material-ui/icons/Home'
import auth from './../auth/auth-helper'
import {Link, withRouter} from 'react-router-dom'

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#ffa726'}
  else
    return {color: '#ffffff'}
}
const Menu = withRouter(({history}) => (
  <AppBar>
    <Toolbar>
      <Typography variant="h6" color="inherit">
        Democracy Book
      </Typography>
      <Link to="/">
        <Iconbutton aria-label="Home" style={isActive(history, "/")}>
          <HomeIcon/>
        </Iconbutton>
      </Link>
      {
        !auth.isAuthenticated() && (<span>
          <Link to="/signup">
            <button style={{margin:"20"}}>Sign up
            </button>
          </Link>
          <Link to="/signin">
            <button style={{margin:"20"}}>Sign In
            </button>
          </Link>
        </span>)
      }
      {
        auth.isAuthenticated() && (<span>
          <Link to={"/user/" + auth.isAuthenticated().user._id}>
            <button style={{margin:"20"}}>My Profile</button>
          </Link>
            <Link to={"/groups"}>
              <button style={{margin:"20"}}>Groups</button>
            </Link>
            <Link to={"/marketplace"}>
              <button style={{margin:"20"}}>Marketplace</button>
            </Link>
          <button style={{margin:"20"}} color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</button>

        </span>)
      }
    </Toolbar>
  </AppBar>
))

export default Menu
