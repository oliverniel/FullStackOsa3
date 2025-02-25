import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data)
}

const remove = (_id) => {
  return axios.delete(`${baseUrl}/${_id}`).then(response => response.data)
}

const create = (newPerson) => {
  return axios
    .post(baseUrl, newPerson)
    .then(response => response.data)  
}

const update = (_id, newObject) => {
  return axios.put(`${baseUrl}/${_id}`, newObject).then(response => response.data)
}

export default { getAll, create, update, remove }