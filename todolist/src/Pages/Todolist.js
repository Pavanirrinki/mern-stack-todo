import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GrCompliance } from 'react-icons/gr';

function Todolist() {
  const [userstodo, setUserstodo] = useState([]);
  const [inputdata, setInputdata] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [toggle, setToggle] = useState(false);
  const [title, setTitle] = useState('');
  const [usersparticulartodo, setUsersparticulartodo] = useState([]);
  const [description, setDescription] = useState('');
  const [editMode, setEditMode] = useState(null);
  const usersdata = JSON.parse(localStorage.getItem('usersdata'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (usersdata?.token !== null) {
      axios
        .get(`http://localhost:5900/alltodos/${usersdata?.existingUser?._id}`)
        .then((res) => {
          setUserstodo(res.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 500) {
            navigate('/');
          }
        });
    } else {
      navigate('/');
    }
  };

  



  const Submittodo = async (e) => {
    e.preventDefault();
    if (title !== '' && description !== '') {
      await axios.post(`http://localhost:5900/add-todo`, {
        title,
        description,
        user: usersdata?.existingUser?._id,
      });
      setTitle('');
      setDescription('');
      fetchData();
    } else {
      alert('Please fill all required fields');
    }
  };

  const Addtask = () => {
    setInputdata(!inputdata);
  };

  function Deletetodo(id, e) {
    e.preventDefault();
    axios.delete(`http://localhost:5900/delete-todo/${id}`).then((res) => {
      alert(res.data);
      fetchData();
    });
  }

  function Edittodo(id, event) {
    event?.preventDefault();
    axios
      .put(`http://localhost:5900/update-todo/${id}`, {
        title,
        description,
        user: usersdata?.existingUser?._id,
      })
      .then((res) => {
        fetchData();
        setEditMode(null);
      });
  }

  const handleEdit = (id) => {
    setEditMode(id);
  };

  function Completestatus(id, title, description, e) {
    e?.preventDefault();
    axios
      .put(`http://localhost:5900/update-todo/${id}`, {
        title: title,
        description: description,
        user: usersdata?.existingUser?._id,
        iscompleted: true,
      })
      .then((res) => {
        fetchData();
      });
  }

  function Deletealltodos(e) {
    e.preventDefault();
    axios
      .delete(`http://localhost:5900/delete-all-todos/${usersdata?.existingUser?._id}`)
      .then((res) => {
        alert(res.data);
        fetchData();
      })
      .catch((error) => alert(error));
  }

  const handleChange = async (event) => {
    setSelectedOption(event.target.value);

    if (event.target.value === 'All') {
      setToggle(false);
    } else {
      axios.get(`http://localhost:5900/filter-todos/${event.target.value}/${usersdata?.existingUser?._id}`).then((res) => {
        setUsersparticulartodo(res.data);
      
        setToggle(true);
      });
    }
  };

  console.log(selectedOption);
  console.log('todos', userstodo);
  console.log('to', usersparticulartodo);

  return (
    <div>
      <section className="vh-100" style={{ backgroundColor: '#eee' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-10">
              <div className="card">
                <div className="card-header p-3">
                  <h5 className="mb-0">Task List</h5>
                  <div className="card-footer text-end p-3">
                    <div className="row">
                      <div className="col">
                        <select id="dropdown" value={selectedOption} onChange={handleChange} style={{borderRadius:"10px",border:"none",width:"30%"}}>
                          <option value="All">All</option>
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      </div>
                      <div className="col">
                     {!toggle &&  <button className="btn btn-danger" onClick={Deletealltodos}>
                          Remove All
                        </button>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body" data-mdb-perfect-scrollbar="true" style={{ position: 'relative' }}>
                  <table className="table mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!toggle &&
                        userstodo?.usertodo?.map((item) => (
                          <tr key={item.id} className="fw-normal">
                            <th>
                              {editMode === item._id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={item.title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              ) : (
                                <div style={{ width: '150px' }}>{item.title}</div>
                              )}
                            </th>
                            <td className="align-middle">
                              {editMode === item._id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={item.description}
                                  onChange={(e) => setDescription(e.target.value)}
                                />
                              ) : (
                                <div style={{ width: '150px' }}>{item.description}</div>
                              )}
                            </td>
                            <td className="align-middle">
                              <h6 className="mb-0">
                                {item?.iscompleted ? (
                                  <span className="badge bg-success">Completed</span>
                                ) : (
                                  <span className="badge bg-danger">pending</span>
                                )}
                              </h6>
                            </td>
                            <td className="align-middle">
                              {editMode === item._id ? (
                                <button className="btn btn-primary" onClick={(e) => Edittodo(item._id)}>
                                  Save
                                </button>
                              ) : (
                                <>
                                  <GrCompliance
                                    style={{ marginRight: '20px' }}
                                    onClick={(e) => Completestatus(item._id, item.title, item.description)}
                                  />
                                  <FiEdit onClick={(e) => handleEdit(item._id)} />
                                  <RiDeleteBin6Line
                                    style={{ marginLeft: '20px' }}
                                    onClick={(e) => Deletetodo(item._id, e)}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tbody>
                      {toggle &&
                        usersparticulartodo?.uersstatus?.map((item) => (
                          <tr key={item.id} className="fw-normal">
                            <th>
                              {editMode === item._id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={item.title}
                                  onChange={(e) => setTitle(e.target.value)}
                                />
                              ) : (
                                <div style={{ width: '150px' }}>{item.title}</div>
                              )}
                            </th>
                            <td className="align-middle">
                              {editMode === item._id ? (
                                <input
                                  type="text"
                                  className="form-control"
                                  defaultValue={item.description}
                                  onChange={(e) => setDescription(e.target.value)}
                                />
                              ) : (
                                <div style={{ width: '150px' }}>{item.description}</div>
                              )}
                            </td>
                            <td className="align-middle">
                              <h6 className="mb-0">
                                {item?.iscompleted ? (
                                  <span className="badge bg-success">Completed</span>
                                ) : (
                                  <span className="badge bg-danger">pending</span>
                                )}
                              </h6>
                            </td>
                            <td className="align-middle">
                              {editMode === item._id ? (
                                <button className="btn btn-primary" onClick={(e) => Edittodo(item._id)}>
                                  Save
                                </button>
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer text-end p-3">
                  <div className="row">
                    {inputdata ? (
                      <>
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter todo title......."
                            value={title}
                            onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                          />
                          <h6 style={{fontSize:"12px"}}>only 50 characters</h6>
                        </div>
                        <div className="col">
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Enter todo description......."
                            style={{ width: '300px' }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value.slice(0,250))}
                          />
                            <h6 style={{fontSize:"12px"}}>only 250 characters</h6>
                        </div>
                        <div className="col">
                          <button type="button" className="btn btn-secondary m-0" onClick={Submittodo}>
                            Submit
                          </button>
                        </div>
                        <div className="col">
                          <button className="me-2 btn btn-link" onClick={Addtask}>
                            Cancel
                          </button>
                        <button className="btn btn-primary" onClick={Addtask}>
                            {inputdata ? 'Hide' : 'Add Task'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="col">
                      {!toggle &&    <button className="btn btn-primary" onClick={Addtask}>
                          {inputdata ? 'Hide' : 'Add Task'}
                        </button>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Todolist;
