import React, {useRef,useState} from 'react'



export default function CreateGroupForm() {
const titleValue = React.useRef('')
const descriptionValue = React.useRef('')
const rule1Value = React.useRef('')
const rule2Value = React.useRef('')
const rule3Value = React.useRef('')
const rule4Value = React.useRef('')
const [toggle, setToggle] = useState(false);
var uri="https://localhost:5000"
if(process.env.NODE_ENV === 'production') {
uri="https://democracybook.herokuapp.com"
}


function handleSubmit(e) {
e.preventDefault()


    const newPost={
      title: titleValue.current.value,
      description:descriptionValue.current.value,
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


      fetch(`${uri}/groups/add`, options)
              .then(response => response.json()).then(json => console.log(json));
setToggle(!toggle)

}

  return (
    <section className='section search'>
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
