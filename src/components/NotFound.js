import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="mt-5 d-flex justify-content-center">
      <Card className="card-shell" style={{ maxWidth: 560, width: '100%' }}>
        <Card.Body className="text-center p-5">
          <h1 className="display-6 mb-2">404</h1>
          <p className="muted-lead mb-4">The page you’re looking for doesn’t exist.</p>
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
        </Card.Body>
      </Card>
    </div>
  );
}

export default NotFound;


