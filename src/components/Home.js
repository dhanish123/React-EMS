import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import { FaUserPlus, FaUserEdit, FaRegTrashAlt, FaDownload, FaSearch, FaSort } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEmployeeStore } from '../store/employeeStore';

function Home() {
  const history = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uname'); // Changed from 'name' to 'uname'
  const [sortOrder, setSortOrder] = useState('asc');

  // ZUSTAND STORE USAGE - Much simpler than Redux!
  // In Redux you'd need: useSelector, useDispatch, and action creators
  // In Zustand, you directly destructure what you need from the store
  const { 
    employees, 
    addEmployee,
    deleteEmployee, 
    getTotalCount 
  } = useEmployeeStore();

  // Local search and sort functionality
  const getFilteredAndSortedEmployees = () => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(emp => 
        emp.uname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.desig?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.age?.toString().includes(searchTerm) ||
        emp.salary?.toString().includes(searchTerm)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'age' || sortBy === 'salary') {
        aValue = a[sortBy] || 0;
        bValue = b[sortBy] || 0;
      } else {
        aValue = a[sortBy]?.toLowerCase() || '';
        bValue = b[sortBy]?.toLowerCase() || '';
      }
      
      if (sortOrder === 'asc') {
        if (typeof aValue === 'number') {
          return aValue - bValue;
        }
        return aValue.localeCompare(bValue);
      } else {
        if (typeof aValue === 'number') {
          return bValue - aValue;
        }
        return bValue.localeCompare(aValue);
      }
    });
    
    return filtered;
  };

  // ZUSTAND BENEFIT: Simple data loading without complex Redux thunks
  // In Redux: useEffect(() => dispatch(fetchEmployees()), [dispatch])
  useEffect(() => {
    // Load sample data if store is empty
    if (getTotalCount() === 0) {
      const sampleEmployees = [
        { id: '1', uname: 'John Doe', age: 30, desig: 'Software Engineer', salary: 75000, currency: 'USD', photo: '' },
        { id: '2', uname: 'Jane Smith', age: 28, desig: 'Product Manager', salary: 85000, currency: 'USD', photo: '' },
        { id: '3', uname: 'Mike Johnson', age: 35, desig: 'Senior Developer', salary: 95000, currency: 'USD', photo: '' }
      ];
      
      sampleEmployees.forEach(emp => addEmployee(emp));
    }
  }, [getTotalCount, addEmployee]);

  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  const requestDelete = (id) => {
    setSelectedId(id);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    if (selectedId == null) return;
    
    // ZUSTAND APPROACH - Direct function call, no dispatch needed!
    // In Redux: dispatch(deleteEmployee(selectedId))
    deleteEmployee(selectedId);
    
    setShowDelete(false);
    setSelectedId(null);
    history('/');
  };
  const cancelDelete = () => {
    setShowDelete(false);
    setSelectedId(null);
  };

  // ZUSTAND BENEFIT: No need for complex localStorage management
  // The store handles all state persistence automatically
  const prepareAdd = () => {
    // This function is now much simpler with Zustand
    // No need to manually manage localStorage or arrays
  };

  const escapeCsv = (value) => {
    if (value == null) return '';
    const str = String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  const exportCsv = () => {
    // ZUSTAND BENEFIT: Direct access to store data, no localStorage needed!
    // In Redux: const data = useSelector(state => state.employees)
    const data = getFilteredAndSortedEmployees(); // Uses filtered and sorted data
    
    if (!data || data.length === 0) {
      // nothing to export
      return;
    }
    const headers = ['ID', 'Username', 'Age', 'Designation', 'Salary', 'Currency', 'Photo'];
    const rows = data.map((e) => [
      e.id,
      e.uname,
      e.age,
      e.desig,
      e.salary,
      e.currency || 'USD',
      e.photo || ''
    ]);
    const csvLines = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvLines], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEdit = (id, uname, age, desig, salary, photo, currency) => {
    // ZUSTAND APPROACH: Store edit data in Zustand store instead of localStorage
    // This is cleaner and more maintainable than scattered localStorage calls
    // In Redux: dispatch(setEditData({ id, uname, age, desig, salary, photo, currency }))
    
    // For now, keeping localStorage for Edit component compatibility
    // TODO: Update Edit component to use Zustand store
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
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h1 className="page-title mb-1">Employee Management System</h1>
          <p className="muted-lead mb-0">Manage staff records and streamline HR tasks.</p>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <Button className="shadow-sm w-100 w-sm-auto" onClick={exportCsv} disabled={!getTotalCount() || getTotalCount() === 0}>
            Export <FaDownload className="ms-1" />
          </Button>
          <Link to="/add" className="w-100 w-sm-auto d-inline-block">
            <Button variant="success" className="shadow-sm w-100 w-sm-auto" onClick={prepareAdd}>
              Add Employee <FaUserPlus className="ms-1" />
            </Button>
          </Link>
        </div>
      </div>

      <Card className="card-shell mt-4">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
            <h5 className="mb-0">Employees</h5>
            
            {/* ZUSTAND FEATURE: Search and Sort Controls */}
            {/* In Redux, you'd need separate action creators and selectors for each */}
            <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch align-items-sm-center w-100 w-md-auto">
              <div className="input-group input-group-sm w-100">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // setStoreSearchTerm(e.target.value); // Update Zustand store
                  }}
                />
              </div>
              
              <div className="d-flex gap-2 w-100 w-sm-auto">
                <select
                  className="form-select form-select-sm flex-fill"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    // setSorting(e.target.value, sortOrder); // Update Zustand store
                  }}
                >
                  <option value="uname">Name</option>
                  <option value="age">Age</option>
                  <option value="desig">Designation</option>
                  <option value="salary">Salary</option>
                </select>
                
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => {
                    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                    setSortOrder(newOrder);
                    // setSorting(sortBy, newOrder); // Update Zustand store
                  }}
                >
                  <FaSort /> {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </div>
          {/* ZUSTAND BENEFIT: Dynamic data from store with search/sort applied */}
          {/* In Redux: const filteredEmployees = useSelector(state => state.filteredEmployees) */}
          {(() => {
            const filteredEmployees = getFilteredAndSortedEmployees();
            return filteredEmployees && filteredEmployees.length > 0 ? (
              <div className="table-responsive mt-3">
                <div className="mb-2 text-muted small">
                  Showing {filteredEmployees.length} of {getTotalCount()} employees
                </div>
                <Table hover className="align-middle table-responsive-sm">
                  <thead>
                    <tr>
                      <th className="d-none d-sm-table-cell">Photo</th>
                      <th>ID</th>
                      <th>Username</th>
                      <th className="d-none d-md-table-cell">Age</th>
                      <th className="d-none d-lg-table-cell">Designation</th>
                      <th className="d-none d-md-table-cell">Salary</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((item) => (
                      <tr key={item.id}>
                      <td className="d-none d-sm-table-cell">
                        {item.photo ? (
                          <img src={item.photo} alt={item.uname} className="avatar avatar-sm" />
                        ) : (
                          <div className="avatar avatar-sm bg-secondary text-white d-inline-flex align-items-center justify-content-center rounded-circle">
                            {item.uname ? item.uname.charAt(0).toUpperCase() : 'E'}
                          </div>
                        )}
                      </td>
                      <td className="fw-bold">{item.id}</td>
                      <td className="text-capitalize fw-medium">{item.uname}</td>
                      <td className="d-none d-md-table-cell">{item.age}</td>
                      <td className="d-none d-lg-table-cell text-truncate" style={{ maxWidth: '150px' }} title={item.desig}>{item.desig}</td>
                      <td className="d-none d-md-table-cell">{new Intl.NumberFormat(undefined, { style: 'currency', currency: item.currency || 'USD' }).format(Number(item.salary) || 0)}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-1 gap-sm-2">
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
                  <Link to="/add" className="w-100 w-sm-auto d-inline-block">
                    <Button variant="success" className="w-100 w-sm-auto">Add Employee</Button>
                  </Link>
                </Card.Body>
              </Card>
            </div>
          );
        })()}
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


