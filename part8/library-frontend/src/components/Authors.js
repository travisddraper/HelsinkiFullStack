import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const BirthForm = ({ options }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [setBornTo, setSetBornTo] = useState('')

  const [ updateBorn ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ ALL_AUTHORS ]
  })

  const submit = (event) => {
    event.preventDefault()

    updateBorn({ variables: { name: selectedOption.value, setBornTo: parseInt(setBornTo) } })
    setSetBornTo('')
  }
  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        /><br/>
        born <input
          value={setBornTo}
          onChange={({ target }) => setSetBornTo(target.value)}
        /><br/>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

const Authors = (props) => {
  
  const result = useQuery(ALL_AUTHORS)

  if(result.loading) return <div>Loading...</div>

  const authors = result.data.allAuthors
  const options = authors.map(author => ( { value: author.name, label: author.name } ) )
  //if(!props.show) return null
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <BirthForm options={options} />
    </div>
  )
}

export default Authors
