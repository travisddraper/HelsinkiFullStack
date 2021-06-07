import React, { useState, useEffect } from 'react'
import './App.css';
import appService from './services/app'
import Notification from './Notification'

function Name({name, number, id, deletePerson}) {

  return (
    <div>
      <span>{name} {number}</span>
      <button onClick={() => deletePerson(id, name)}>Delete</button>
    </div>
  )
}

function Persons({filterPersons, deletePerson}) {

  return (
    <>
    {filterPersons.map(person => (
      <Name key={person.id} id={person.id} name={person.name} number={person.number} deletePerson={deletePerson} />
    ))
    }
    </>
  )
}

function Filter({filter, handleFilterChange}) {

  return (
    <div>
      filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}


function PersonForm({handleSubmit, handleNameChange, handleNumberChange, newName, newNumber}) {

  return (
    <form onSubmit={handleSubmit}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

function App() {
  const [ persons, setPersons ] = useState([])

  const [ error, setError ] = useState({
    errorMessage: '',
    errorType: true,
  })

  const [newName, setNewName ] = useState('')
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const [newNumber, setNewNumber ] = useState('')
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const [filter, setFilter ] = useState('')
  const handleFilterChange =(event) => {
    setFilter(event.target.value)
  }

  const handleMessage = (message, boolean) => {

    setError({
      errorMessage: message,
      errorType: boolean,
    })

    setTimeout(() => {
      setError({
        errorMessage: '',
        errorType: true,
      })
    }, 2000)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(newName && newNumber) {
      if(persons.find(person => person.name.toLowerCase() === newName.toLowerCase())) {
        if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const person = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
          const newPerson = {...person, number: newNumber}
          appService
          .update(person.id, newPerson)
          .then(newPerson => {
            setPersons(persons.map(person => person.id !== newPerson.id ? person : newPerson ))
            handleMessage(`${newPerson.name}'s number was changed to ${newPerson.number}`, true)
          })
          .catch(error =>{
            handleMessage(`Information on ${newPerson.name} has already been removed from the server`, false)
          })
          setNewName('');
          setNewNumber('');
          return
        } else {
          setNewName('');
          setNewNumber('');
          return
        }
      }

      const newPerson = {
        name: newName,
        number: newNumber,
      }

      appService
      .create(newPerson)
      .then(person => setPersons(persons.concat(person)))
      handleMessage(`${newPerson.name} was successfully added to the phonebook!`, true)
      setNewName('');
      setNewNumber('')
    } else {
      alert('Please complete both fields to submit a new registry addition')
    }
  }

  useEffect(() => {
    appService
    .getAll()
    .then(persons => setPersons(persons))
  }, [])

  const filterPersons = !filter
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  const deletePerson = (id, name) => {
    if(window.confirm(`Delete ${name}?`)) {
      appService
      .remove(id)
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={error.errorMessage} type={error.errorType}  />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>add a new </h3>

        <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons filterPersons={filterPersons} deletePerson={deletePerson} />
    </div>
  );
}

export default App;
