import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'



export default function CreateGroupForm() {
  console.log("coordinates")
  console.log(auth.isAuthenticated().user.coordinates)
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const rule1Value = React.useRef('')
const rule2Value = React.useRef('')
const rule3Value = React.useRef('')
const rule4Value = React.useRef('')
const [toggle, setToggle] = useState(false);



function handleSubmit(e) {


    const newPost={
      title: titleValue.current.value,
      description:descriptionValue.current.value,
      centroid:auth.isAuthenticated().user.coordinates,
      rule1:rule1Value.current.value,
      rule2:rule2Value.current.value,
      rule3:rule3Value.current.value,
      rule4:rule4Value.current.value,

    }
    console.log(newPost)
    const options={
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      fetch("groups/add", options)
              .then(response => response.json()).then(json => console.log(json));


}


  return (
    <section className='section search'>
    <p>In Democracy Book, we aim to keep groups fairly small so that each member has an opportunity to speak and engage with
    discussions. We want a deliberative democracy where we try to reach decisions that are both well informed and as many people as possible
    are happy with them. We would also like you to get to know the people fairly well. If a group gets larger than 40 people, it breaks into two groups of 20, you get placed with the
    people geographically closest to you. You do not need to stay there, you can leave and go to the other group if you prefer.
    When groups split, a higher level group is formed to represent them both. It consists of 8 people chosen at random from
    the whole collection of 80 people (both bottom level groups) plus the 8 elected leaders from both bottom groups. This group
    will again need to elect 4 higher level leaders.
    If the bottom groups continue to expand and split, more members will be added to the upper level group. When it get's larger
    than 40 members it will split again forming a third level. This pattern of growth, splitting and forming higher level groups
    will repeat indefinately using the same pattern each time. All of this is a pragmatic attempt to ensure leadership is assigned
    based on merit rather than the leaders becoming an insular closed circle. 
    </p>
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='titleValue'
          id='titleValue'
          ref={titleValue}

        />
        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='descriptionValue'
          id='descriptionValue'
          ref={descriptionValue}

        />
        <label htmlFor='name'>Rule 1</label>
        <input
          type='text'
          name='rule1Value'
          id='rule1Value'
          ref={rule1Value}

        />
          <label htmlFor='name'>Rule 2</label>
        <input
          type='text'
          name='rule2Value'
          id='rule2Value'
          ref={rule2Value}
        />
        <label htmlFor='name'>Rule 3</label>
        <input
          type='text'
          name='rule3Value'
          id='rule3Value'
          ref={rule3Value}

        />
          <label htmlFor='name'>Rule 4</label>
        <input
          type='text'
          name='rule4Value'
          id='rule4Value'
          ref={rule4Value}
        />

          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
  )}
