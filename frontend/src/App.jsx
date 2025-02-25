import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/personService'
import Notification from './components/Notification'




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [notification, setNotification] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault();
  
    if (newName.length < 3) {
      setNotification('Name must be at least 3 characters long');
      setMessageType('error');
      setTimeout(() => setNotification(null), 5000);
      return;
    }
  
    const phonePattern = /^\d{2,3}-\d+$/;
    if (!phonePattern.test(newNumber) || newNumber.replace(/-/g, '').length < 8) {
      setNotification('Phone number must be in the format 09-1234567 or 040-9656535 and at least 8 digits long');
      setMessageType('error');
      setTimeout(() => setNotification(null), 5000);
      return;
    }
  
    const personObject = { name: newName, number: newNumber };
  
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
        setNotification(`Added ${newName}`);
        setMessageType('success')
        setTimeout(() => setNotification(null), 3000);
      })
      .catch(error => {
        const errorMessage = error.response?.data?.error || `Error adding ${newName}`;
        setNotification(errorMessage);
        setMessageType('error');
        setTimeout(() => setNotification(null), 5000);
      });
  };
  
  
  

  const deletePerson = (id) => {  
    const person = persons.find(person => person.id === id);  
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)  
        .then(() => {
          setPersons(persons.filter(person => person.id !== id)); 
          setNotification(`Deleted ${person.name}`);
          setMessageType('success')
          setTimeout(() => setNotification(null), 3000);
        })
        .catch(error => {
          setNotification(`Error deleting ${person.name}`);
          setMessageType('error')
          setTimeout(() => setNotification(null), 3000);
        });
    }
};



  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} type={messageType}/>
      <Filter value={searchQuery} onChange={handleSearchChange} />
      <h2>Add New</h2>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} onDelete={deletePerson} />
    </div>
  )
}

export default App