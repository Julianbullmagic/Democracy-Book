import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import Newsfeed from './../post/Newsfeed'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5)
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: theme.palette.text.secondary
  },
  media: {
    minHeight: 400
  },
  credit: {
    padding: 10,
    textAlign: 'right',
    backgroundColor: '#ededed',
    borderBottom: '1px solid #d0d0d0',
    '& a':{
      color: '#3f4771'
    }
  }
}))

export default function Home({history}){
  const classes = useStyles()
  const [defaultPage, setDefaultPage] = useState(false)

  fetch("https://democracybook.herokuapp.com/groups/findgroups/").then(res => {
    return res.json();
  }).then(info=>{console.log(info)})


  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (
      <div className={classes.root}>

        { !defaultPage &&
          <Grid container spacing={8}>

            <Grid item xs={12}>
              <Card className={classes.card}>
                <Typography variant="h6" className={classes.title}>
                  Home Page
                </Typography>
                <CardMedia className={classes.media} image={unicornbikeImg} title="Unicorn Bicycle"/>
                <Typography variant="body2" component="p" className={classes.credit} color="textSecondary">Photo by <a href="https://unsplash.com/@boudewijn_huysmans" target="_blank" rel="noopener noreferrer">Boudewijn Huysmans</a> on Unsplash</Typography>
                <CardContent>
                  <Typography type="body1" component="p">
                    Welcome to Democracy Book

                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <Grid container spacing={8}>
          <br/>
          <br/>
          <br/>
          <br/>
          <p style={{"margin":"20px","padding":"20px"}}>   Welcome to Democracy Book, the socialist social network where your thoughts and opinions really matter.
                You should be involved in making decisions about things if it is relevant to you or if you
                have the expertise to understand. We aim to eliminate coercive and exploitative kinds of authority.
                Authority should be given to the most ethical, wise, responsible and informed people rather than the most sociopathic or greedy.
                We have elected expert leaders/advisers. This should not be power in the common sense of the word, but rather people voluntarily
                taking good advice or allowing trustworty experts to make decisions for them. Power, in the sense of being able to impose one's will onto others,
                is always illegitimate. This site is constantly being refined and improved by it's members, all the source code is open  source and visible on
                Github. We welcome constructive criticism from people who believe a world without exploitation and oppression is possible. Cynicism and anti-socialist prejudice are not welcome here.</p>
            <Grid item xs={8} sm={7}>
              <Newsfeed/>
            </Grid>
            <Grid item xs={6} sm={5}>
              <FindPeople/>
            </Grid>
          </Grid>
        }
      </div>
    )
}
