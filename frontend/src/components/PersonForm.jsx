import PropTypes from 'prop-types'


const PersonForm = ({ onSubmit, name, number, onNameChange, onNumberChange }) => {
    return (
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={name} onChange={onNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={onNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
  };
  
  PersonForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    onNameChange: PropTypes.func.isRequired,
    onNumberChange: PropTypes.func.isRequired,
  }

export default PersonForm