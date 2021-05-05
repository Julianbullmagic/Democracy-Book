import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import auth from './../auth/auth-helper'
import PostList from './PostList'
import {listNewsFeed} from './api-post.js'
import NewPost from './NewPost'

const useStyles = makeStyles(theme => ({
  card: {
    margin: 'auto',
    paddingTop: 0,
    paddingBottom: theme.spacing(3)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.openTitle,
    fontSize: '1em'
  },
  media: {
    minHeight: 330
  }
}))
export default function Newsfeed (props) {

  const classes = useStyles()
  const [posts, setPosts] = useState([])
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    console.log("groupId",props.groupId)
    if(props.groupId){
    listNewsFeed({
      userId: jwt.user._id,
      groupId:props.groupId
    },
    {
      t: jwt.token
    }, signal).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setPosts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }}else{
      listNewsFeed({
        userId: jwt.user._id},
      {
        t: jwt.token
      }, signal).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          setPosts(data)
        }
      })
      return function cleanup(){
        abortController.abort()
      }
    }

  }, [])

  const addPost = (post) => {
    const updatedPosts = [...posts]
    updatedPosts.unshift(post)
    setPosts(updatedPosts)
  }
  const removePost = (post) => {
    const updatedPosts = [...posts]
    const index = updatedPosts.indexOf(post)
    updatedPosts.splice(index, 1)
    setPosts(updatedPosts)
  }

    return (
      <Card className={classes.card}>
        <Typography type="title" className={classes.title}>
          Newsfeed
        </Typography>
        <Divider/>
        <NewPost addUpdate={addPost} groupId={props.groupId} leaders={props.leaders}/>
        <Divider/>
        {posts.length>1 && <PostList removeUpdate={removePost} posts={posts} groupId={props.groupId}/>}
      </Card>
    )
}
