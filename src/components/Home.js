import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Employee from './Employee';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FaUserPlus, FaUserEdit, FaRegTrashAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const history = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  const requestDelete = (id) => {
    setSelectedId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (selectedId == null) return;
    const index = Employee.map((item) => item.id).indexOf(selectedId);
    if (index !== -1) {
      Employee.splice(index, 1);
    }
    try {
      localStorage.setItem('employees', JSON.stringify(Employee));
    } catch {}
    setShowDelete(false);
    setSelectedId(null);
    history('/');
  };
  const cancelDelete = () => {
    setShowDelete(false);
    setSelectedId(null);
  };

  const prepareAdd = () => {
    // If no saved list exists (we are showing seed data), clear it so user starts fresh
    const existing = localStorage.getItem('employees');
    if (!existing) {
      // empty in-memory array
      Employee.length = 0;
      try {
        localStorage.setItem('employees', JSON.stringify([]));
      } catch {}
    }
  };

  const handleEdit = (id, uname, age, desig, salary, photo, currency) => {
    localStorage.setItem('id', id);
    localStorage.setItem('uname', uname);
    localStorage.setItem('age', age);
    localStorage.setItem('desg', desig);
    localStorage.setItem('salary', JSON.stringify(salary));
    if (currency) {
      localStorage.setItem('currency', currency);
    } else {
      localStorage.removeItem('currency');
    }
    if (photo) {
      localStorage.setItem('photo', photo);
    } else {
      localStorage.removeItem('photo');
    }
  };

  return (
    <div className="mt-3 mt-md-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h1 className="page-title mb-1">Employee Management System</h1>
          <p className="muted-lead mb-0">Manage staff records and streamline HR tasks.</p>
        </div>
        <div>
          <Link to="/add">
            <Button variant="success" className="shadow-sm" onClick={prepareAdd}>
              Add Employee <FaUserPlus className="ms-1" />
            </Button>
          </Link>
        </div>
      </div>

      <Card className="card-shell mt-4">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between flex-wrap">
            <h5 className="mb-3 mb-md-0">Employees</h5>
          </div>
          {Employee && Employee.length > 0 ? (
            <div className="table-responsive mt-3">
              <Table hover className="align-middle">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Age</th>
                    <th>Designation</th>
                    <th>Salary</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Employee.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.photo ? (
                          <img src={item.photo} alt={item.uname} className="avatar avatar-sm" />
                        ) : (
                          <div className="avatar avatar-sm bg-secondary text-white d-inline-flex align-items-center justify-content-center rounded-circle">
                            {item.uname ? item.uname.charAt(0).toUpperCase() : 'E'}
                          </div>
                        )}
                      </td>
                      <td>{item.id}</td>
                      <td className="text-capitalize">{item.uname}</td>
                      <td>{item.age}</td>
                      <td>{item.desig}</td>
                      <td>{new Intl.NumberFormat(undefined, { style: 'currency', currency: item.currency || 'USD' }).format(Number(item.salary) || 0)}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <Link to="/edit">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                handleEdit(item.id, item.uname, item.age, item.desig, item.salary, item.photo, item.currency)
                              }
                            >
                              <FaUserEdit />
                            </Button>
                          </Link>
                          <Button size="sm" variant="danger" onClick={() => requestDelete(item.id)}>
                            <FaRegTrashAlt />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="mt-3">
              <Card className="card-shell">
                <Card.Body className="text-center">
                  <h5 className="mb-2">No employees yet</h5>
                  <p className="muted-lead mb-3">Get started by adding your first employee.</p>
                  <Link to="/add">
                    <Button variant="success">Add Employee</Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDelete} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete employee?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this record?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Home;


