import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';

const APIUrl = 'http://localhost:8000/restaurants/';

async function getRestaurantsFromAPI(locationFilter = '') {
  const restaurants = await fetch(APIUrl.concat(`?location_filter=${locationFilter}`));
  return restaurants.json();
}

async function createRestaurantAPI(newRestaurant) {
  // post /restaurants body
  const restaurant = await fetch(APIUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: newRestaurant.name,
      location: newRestaurant.location,
      food_type: newRestaurant.food_type,
      qualification: newRestaurant.qualification,
      visited: newRestaurant.visited
    })
  });
  return restaurant.json();
}

async function updateRestaurantAPI(selectedRestaurant) {
  // post /restaurants/update body con id
  const restaurant = await fetch(APIUrl.concat('update'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: selectedRestaurant.id,
      name: selectedRestaurant.name,
      location: selectedRestaurant.location,
      food_type: selectedRestaurant.food_type,
      qualification: selectedRestaurant.qualification,
      visited: selectedRestaurant.visited
    })
  });
  return restaurant.json();
}

async function deleteRestaurantAPI(restaurantId) {
  // delete /restaurants/:id
  const restaurant = await fetch(APIUrl.concat(restaurantId), {
    method: 'DELETE'
  });
  return restaurant.json();
}


function App() {

  const [data, setData] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState({
    id: '',
    name: '',
    location: '',
    food_type: '',
    qualification: null,
    visited: false
  });
  const [modalNew, setModalNew] = useState(false);
  const [modalSort, setModalSort] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: null,
    mode: null,
  });
  const [filterName, setFilterName] = useState('');
  const [filterLocation, setFilterLocation] = useState('');


  useEffect(() => {
    async function fetchData() {
      const dataRestaurants = await getRestaurantsFromAPI();
      setData(dataRestaurants);
    }
    fetchData();
  }, []);

  
  
  const handleChange = e => {
    const { name, value } = e.target;
    setSelectedRestaurant((prevState)=>({
      ...prevState,
      [name]: value
    }));
  }

  const selectRestaurant = (restaurant, action) => {
    setSelectedRestaurant(restaurant);
    (action ==='Edit') ? setModalEdit(true) : deleteRestaurant()
  }

  const edit = async () => {
    var newData = data;
    const updatedRestaurant = await updateRestaurantAPI(selectedRestaurant);
    newData.map(restaurant => {
      if (restaurant.id === updatedRestaurant.id) {
        restaurant.name = updatedRestaurant.name;
        restaurant.location = updatedRestaurant.location;
        restaurant.food_type = updatedRestaurant.food_type;
        restaurant.qualification = updatedRestaurant.qualification;
        restaurant.visited = updatedRestaurant.visited;
      }
    });
    setData(newData);
    setModalEdit(false);
  }

  const deleteRestaurant = async () => {
    const deletedRestaurant = await deleteRestaurantAPI(selectedRestaurant.id);
    setData(data.filter(restaurant => restaurant.id !== deletedRestaurant.id));
  }

  const openModalNew = () => {
    setSelectedRestaurant(null);
    setModalNew(true);
  }

  const addRestaurant = async () => {
    const newData = data;
    const newRestaurant = await createRestaurantAPI(selectedRestaurant);
    newData.push(newRestaurant);
    setData(newData);
    setModalNew(false);
  }

  let sortedData = [...data];
  if (sortConfig.field && sortConfig.mode) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.field] < b[sortConfig.field]) {
        return sortConfig.mode === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.field] > b[sortConfig.field]) {
        return sortConfig.mode === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  let filteredData = sortedData.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(filterName.toLowerCase())
  })
  
  const handleSortChange = e => {
    const { name, value } = e.target;
    setSortConfig((prevState)=>({
      ...prevState,
      [name]: value
    }));
  }

  const sortTable = () => {
    const newConfig = sortConfig;
    setSortConfig(newConfig);
    setModalSort(false);
  }

  const handleFilterChange = e => {
    const { value } = e.target;
    setFilterName(value)
  }

  const handleFilterLocationChange = e => {
    const { value } = e.target;
    setFilterLocation(value)
  }

  const filterByLocation = async () => {
    const filteredRestaurants = await getRestaurantsFromAPI(filterLocation);
    setData(filteredRestaurants);
  }

  return (
    <div className="container">
      <h2>Restaurantes</h2>
      <div className="row">
        <div className="col-md-auto">
          <button className="btn btn-success" onClick={openModalNew}>Agregar restaurant</button>
        </div>
        <div className="col-md-auto">
          <div className="row">
            <div className="col-md-auto">
              <p>Ordenar por columna: </p>
            </div>
            <div className="col-md-auto">
              <select name="field"
                      value={sortConfig && sortConfig.field}
                      onChange={handleSortChange}
              >
                <option selected value="null">Selecciona una columna</option>
                <option value="name">Nombre</option>
                <option value="location">Ubicación</option>
                <option value="food_type">Tipo de comida</option>
                <option value="qualification">Calificación</option>
                <option value="visited">Visitado</option>
              </select>
            </div>
            <div className="col-md-auto">
              <select name="mode"
                      value={sortConfig && sortConfig.mode}
                      onChange={handleSortChange}
              >
                <option selected value="null">Selecciona un modo</option>
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-auto">
          <input
            className="form-control"
            type="text"
            name="name"
            placeholder="Filtrar por nombre"
            onChange={handleFilterChange}
          />
        </div>
        <div className="col-md-auto">
          <input
            className="form-control"
            type="text"
            name="location"
            placeholder="Filtrar por ubicación"
            onChange={handleFilterLocationChange}
          />
          <button onClick={() => filterByLocation()}>Filtrar</button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Tipo de comida</th>
            <th>Calificación</th>
            <th>Vistado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(restaurant=>(
              <tr>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>{restaurant.food_type}</td>
                <td>{restaurant.qualification}</td>
                <td>
                  {restaurant.visited ? 'Sí' : 'No'}
                </td>
                <td><button className="btn btn-primary" onClick={() => selectRestaurant(restaurant, 'Edit')}>Editar</button> {"   "} 
                <button className="btn btn-danger" onClick={() => selectRestaurant(restaurant, 'Delete')}>Eliminar</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <Modal isOpen={modalEdit}>
        <ModalHeader>
          <div>
            <h3>Editar restaurant</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={selectedRestaurant && selectedRestaurant.name}
              onChange={handleChange}
            />
            <br />

            <label>Ubicación</label>
            <input
              className="form-control"
              type="text"
              name="location"
              value={selectedRestaurant && selectedRestaurant.location}
              onChange={handleChange}
            />
            <br />

            <label>Tipo de comida</label>
            <input
              className="form-control"
              type="text"
              name="food_type"
              value={selectedRestaurant && selectedRestaurant.food_type}
              onChange={handleChange}
            />
            <br />

            <label>Calificación</label>
            <input
              className="form-control"
              type="number"
              name="qualification"
              value={selectedRestaurant && selectedRestaurant.qualification}
              min="1"
              max="5"
              onChange={handleChange}
            />
            <br />

            <label>
            <input
              type="checkbox"
              name="visited"
              checked={selectedRestaurant && selectedRestaurant.visited}
              onChange={handleChange}
            /> Visitado </label>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick = {() => edit()}>
            Actualizar
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setModalEdit(false)}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalNew}>
        <ModalHeader>
          <div>
            <h3>Nuevo restaurant</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nombre</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Nombre del local"
              value={selectedRestaurant ? selectedRestaurant.name : ''}
              onChange={handleChange}
            />
            <br />

            <label>Ubicación</label>
            <input
              className="form-control"
              type="text"
              name="location"
              placeholder="Ciudad, País"
              value={selectedRestaurant ? selectedRestaurant.location : ''}
              onChange={handleChange}
            />
            <br />

            <label>Tipo de comida</label>
            <input
              className="form-control"
              type="text"
              name="food_type"
              placeholder="Hambuerguesas, sushi, pastelería..."
              value={selectedRestaurant ? selectedRestaurant.food_type : ''}
              onChange={handleChange}
            />
            <br />

            <label>Calificación</label>
            <input
              className="form-control"
              type="number"
              name="qualification"
              value={selectedRestaurant ? selectedRestaurant.qualification : null}
              min="1"
              max="5"
              onChange={handleChange}
            />
            <br />

            <label>
            <input
              type="checkbox"
              name="visited"
              checked={selectedRestaurant ? selectedRestaurant.visited : false}
              onChange={handleChange}
            /> Visitado</label>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick = {() => addRestaurant()}>
            Guardar restaurant
          </button>
          <button
            className="btn btn-danger"
            onClick={() => setModalNew(false)}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalSort}>
        <ModalHeader>
          <div>
            <h3>Ordenar tabla</h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Columna</label>
            <select class="form-select"
                    aria-label="column select"
                    name="field"
                    value={sortConfig && sortConfig.field}
                    onChange={handleSortChange}
            >
              <option value="name">Nombre</option>
              <option value="location">Ubicación</option>
              <option value="food_type">Tipo de comida</option>
              <option value="qualification">Calificación</option>
              <option value="visited">Visitado</option>
            </select>
            <br />

            <label>Modo</label>
            <select class="form-select"
                    aria-label="mode select"
                    name="mode"
                    value={sortConfig && sortConfig.mode}
                    onChange={handleSortChange}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick = {sortTable}>
            Ordenar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setModalSort(false)}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;
