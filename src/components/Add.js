import React, { useState } from 'react';
import Employee from './Employee';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';

function Add() {
  const [id, setId] = useState('');
  const [uname, setUname] = useState('');
  const [age, setAge] = useState('');
  const [desig, setDesig] = useState('');
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [validated, setValidated] = useState(false);
  const [photo, setPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const placeholderSvg = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><rect width="96" height="96" rx="16" fill="#eef2f7"/><circle cx="48" cy="36" r="14" fill="#cbd5e1"/><rect x="20" y="58" width="56" height="24" rx="12" fill="#cbd5e1"/></svg>`);

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setPhoto('');
      setPhotoError('');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result || '');
      setPhotoError('');
    };
    reader.readAsDataURL(file);
  };

  let history = useNavigate();
  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isValid =
      uname.trim() !== '' &&
      desig.trim() !== '' &&
      age !== '' &&
      salary !== '' &&
      Number(age) > 0 &&
      Number(salary) > 0;

    setValidated(true);
    if (!isValid) {
      return;
    }
    if (!photo) {
      setPhotoError('Please upload a photo.');
      return;
    }

    let ids = uuid();
    let uniqueId = ids.slice(0, 8);
    Employee.push({
      id: uniqueId,
      uname: uname.trim(),
      age: age,
      desig: desig.trim(),
      salary: salary,
      currency: currency,
      photo: photo,
    });
    try {
      localStorage.setItem('employees', JSON.stringify(Employee));
    } catch {}

    history('/');
  };

  return (
    <div className="mt-3 mt-md-4">
      <h1 className="page-title text-center text-md-start">Add Employee</h1>
      <p className="muted-lead text-center text-md-start">Create a new employee record.</p>
      <Row className="align-items-start mt-3 g-3">
        <Col xs={12} md={6} className="mb-4">
          <Card className="card-shell h-100">
            <Card.Body>
              <Form noValidate validated={validated} onSubmit={handleAdd}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    required
                    value={uname}
                    onChange={(e) => setUname(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">Please enter a username.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Label>Age</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter age"
                    required
                    min={1}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">Please enter a valid age.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicDesignation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Developer"
                    required
                    value={desig}
                    onChange={(e) => setDesig(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">Please enter a designation.</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSalary">
                  <Form.Label>Salary</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter salary"
                    required
                    min={1}
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">Please enter a valid salary.</Form.Control.Feedback>
                </Form.Group>

               

                <Form.Group className="mb-3" controlId="formBasicPhoto">
                  <Form.Label>Photo (required)</Form.Label>
                  <div className={`file-drop ${photo ? '' : ''}`}>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    <img src={photo || placeholderSvg} alt="Preview" className="avatar avatar-lg" />
                    <div className="file-meta">
                      <div className="file-name">{photo ? 'Photo selected' : 'Choose a photo'}</div>
                      <div className="file-hint">Click to browse. PNG or JPG up to ~2MB.</div>
                    </div>
                    {photo && (
                      <div className="ms-auto">
                        <Button variant="outline-danger" size="sm" onClick={() => setPhoto('')}>Remove</Button>
                      </div>
                    )}
                  </div>
                  {validated && !photo && (
                    <div className="text-danger mt-1">{photoError || 'Please upload a photo.'}</div>
                  )}
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" type="submit">
                    Add Employee
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card className="card-shell h-100">
            <Card.Body className="d-flex align-items-center justify-content-center">
              <img
                className="img-fluid"
                src="https://th.bing.com/th/id/OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH?pid=ImgDet&rs=1"
                alt="Employee Management"
                style={{ maxHeight: '360px' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Add;
