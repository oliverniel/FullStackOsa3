import PropTypes from 'prop-types'


const Persons = ({ persons, onDelete }) => {
    return (
      <ul>
        {persons.map((person, index) => (
          <li key={index}>
            {person.name} {person.number}
            <button onClick={() => onDelete(person.id)}>delete</button>
          </li>
        ))}
      </ul>
    );
  };
  
  Persons.propTypes = {
    persons: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        number: PropTypes.string.isRequired,
      })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
  }
  export default Persons      