import React, {useRef} from 'react'
import auth from './../auth/auth-helper'



export default function CreateItemForm() {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const priceorrate = React.useRef('')
const labourtime = React.useRef('')




function handleSubmit(e) {



    const newItem={
      title: titleValue.current.value,
      description:descriptionValue.current.value,
    priceorrate:priceorrate.current.value,
    labourtime:labourtime.current.value
    }
    console.log(newItem)
    const options={
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      fetch("https://democracybook.herokuapp.com/marketplace/add/"+ auth.isAuthenticated().user._id, options)
              .then(response => response.json()).then(json => console.log(json));


}

  return (
    <div>
    <section className='section search'>
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='form-control'>
        <label htmlFor='name'>Title</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={titleValue}

        />
        <label htmlFor='name'>Description</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={descriptionValue}

        />
        <label htmlFor='name'>Price or Rate</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={priceorrate}
        />
        <label htmlFor='name'>Labour Time? How long does it take you to make this thing or do this job?</label>
        <input
          type='text'
          name='name'
          id='name'
          ref={labourtime}

        />

          <input type="submit" value="Submit" />
        </div>
      </form>
    </section>
    </div>
  )}
