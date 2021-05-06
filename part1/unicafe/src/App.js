import React, { useState } from 'react'

const Button = (props) => {
  const { text } = props;

  return (
    <button className="btn btn-small" onClick={props.handleClick}>{text}</button>
  )
}


const Statistic = (props) => {

  const { text, stat } = props

  return (
    <tr>
      <td>{text}</td>
      <td>{stat}</td>
    </tr>
  )
}


const Statistics = (props) => {
  const { good, neutral, bad } = props
  let all = good + neutral + bad;
  let average = (good-bad)/all;
  let positive = good/all + '%';

  if(all === 0) {
    return (
      <p>No feedback given yet!</p>
    )
  }

  return (
    <table>
      <tbody>
      <Statistic text="Good" stat={good} />
      <Statistic text="Neutral" stat={neutral} />
      <Statistic text="Bad" stat={bad} />
      <Statistic text="All" stat={all} />
      <Statistic text="Average" stat={average} />
      <Statistic text="Positive" stat={positive} />
      </tbody>
    </table>
  )
}



const App = () => {

  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const[bad, setBad] = useState(0);

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
