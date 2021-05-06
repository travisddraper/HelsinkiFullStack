import React, { useState } from 'react'


const Button = (props) => {
  const { text, handleClick } = props;

  return (
    <button onClick={handleClick}>{text}</button>
  )
}


const AnecdoteReader = (props) => {

  const {text, anecdote} = props;

  return (
    <>
      <h1>{text}</h1>
      <p>{anecdote}</p>
    </>
  )
}


const MostPopular = (props) => {
  let { anecdote } = props;

  return (
    <>
    <p>{anecdote}</p>
    </>
  )
}



const App = () => {
  const [selected, setSelected] = useState(0);
  const [votes, updateVotes] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,

  });

  let voteCounter = 0;
  let index = 0;
  for (const key in votes) {
    if (votes[key] > voteCounter) {
      voteCounter = votes[key]
      index = key
    }
  }

  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const randomizer = () => {
    let random =  Math.floor(Math.random() * (anecdotes.length))
    setSelected(random)
  }

  const voter = () => {
    const copy = {...votes}
    copy[selected] += 1;
    updateVotes(copy);
  }

  return (
    <div>
      <AnecdoteReader text="Anecdote of the Day" anecdote={anecdotes[selected]} />
      <p>has {votes[selected]} votes</p>
      <Button handleClick={voter} text="Vote" />
      <Button handleClick={randomizer} text="Next anecdote" />
      <AnecdoteReader text="Anecdote with the Most Votes" anecdote={anecdotes[index]} />
      <p>has {votes[index]} votes</p>
    </div>
  )
}

export default App
