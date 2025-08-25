
import React, { useState, useEffect } from 'react';
import Employee from './Employee';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

function Edit() {
  const [id, setId] = useState('');
  const [uname, setUname] = useState('');
  const [age, setAge] = useState('');
  const [desig, setDesig] = useState('');
  const [salary, setSalary] = useState(0);
  const [photo, setPhoto] = useState('');
  const [validated, setValidated] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    setId(localStorage.getItem('id'));
    setUname(localStorage.getItem('uname'));
    setAge(localStorage.getItem('age'));
    setDesig(localStorage.getItem('desg'));
    setSalary(JSON.parse(localStorage.getItem('salary')));
    const storedCurrency = localStorage.getItem('currency');
    if (storedCurrency) setCurrency(storedCurrency);
    const storedPhoto = localStorage.getItem('photo');
    if (storedPhoto) setPhoto(storedPhoto);
  }, []);

  const index = Employee.map((item) => item.id).indexOf(id);
  const history = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setValidated(true);
    if (!photo) {
      setPhotoError('Please upload a photo.');
      return;
    }
    let emp = Employee[index];
    emp.uname = uname;
    emp.age = age;
    emp.desig = desig;
    emp.salary = salary;
    emp.photo = photo;
    emp.currency = currency;
    try {
      localStorage.setItem('employees', JSON.stringify(Employee));
    } catch {}
    history('/');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result || '';
      setPhoto(dataUrl);
      localStorage.setItem('photo', dataUrl);
      setPhotoError('');
    };
    reader.readAsDataURL(file);
  };
  const removePhoto = () => {
    setPhoto('');
    localStorage.removeItem('photo');
  };

  return (
    <div className="mt-3 mt-md-4">
      <h1 className="page-title text-center text-md-start">Update Employee</h1>
      <p className="muted-lead text-center text-md-start">Modify an existing employee record.</p>
      <Row className="align-items-start mt-3 g-3">
        <Col xs={12} md={6} className="mb-4 order-1 order-md-1">
          <Card className="card-shell h-100">
            <Card.Body>
              <Form noValidate validated={validated}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                    placeholder="Enter name"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDesignation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={desig}
                    onChange={(e) => setDesig(e.target.value)}
                    placeholder="e.g., Developer"
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSalary">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Enter salary"
                  />
                </Form.Group>

             

                <Form.Group controlId="formEditPhoto" className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <div className="file-drop">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    <div className="file-meta">
                      <div className="file-name">{photo ? 'Photo selected' : 'Choose a photo'}</div>
                      <div className="file-hint">Click to browse. PNG or JPG up to ~2MB.</div>
                    </div>
                    {photo && (
                      <div className="ms-auto">
                        <Button variant="outline-danger" size="sm" onClick={removePhoto}>Remove</Button>
                      </div>
                    )}
                  </div>
                  {validated && !photo && (
                    <div className="text-danger mt-1">{photoError || 'Please upload a photo.'}</div>
                  )}
                </Form.Group>

                <Button
                  onClick={(e) => handleUpdate(e)}
                  variant="primary"
                  type="submit"
                  className="w-100"
                >
                  Update Employee
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} className="order-2 order-md-2">
          <Card className="card-shell h-100">
            <Card.Body>
              <img
                className="img-fluid rounded"
                src="https://th.bing.com/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?pid=ImgDet&rs=1"
                alt="Employee Management"
                style={{ maxHeight: '220px', width: '100%', objectFit: 'contain' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Edit;
