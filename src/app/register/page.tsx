'use client';
import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

export default function Home() {
  const [name1, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5000';

  const registerUser = async () => {
  try {
    const res1 = await axios.post(
      `${backendUrl}/profile/register`,
      { name: name1 },
      {
        headers: {
          'Content-Type': 'application/json', 
        },
      }
    );
    setMessage('Success! Your user id is ' + res1.data.user);
  } catch (err) {
    console.error(err); 
    setMessage('Error during registration');
  }
};


  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/profile/${userId}`);
      setUserData(res.data.name);
    } catch (err) {
      setMessage('User not found.');
    }
  };

 return (
    <div
      style={{
        background: '#f9f9fb',
        minHeight: '100vh',
        padding: '2rem 2rem',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      <Container style={{ maxWidth: '450px' }}>
        <h1
          style={{
            fontFamily: `'Georgia', 'Times New Roman', serif`,
            fontWeight: 'bold',
            fontSize: '2.8rem',
            color: '#1a1a1a',
            textAlign: 'center',
          }}
        >
          ModulusAI
        </h1>


        <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <Card.Body>
            <h4 style={{ fontWeight: 500 }}>👤 Register</h4>
            <Form.Group className="mt-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Arjun"
                onChange={e => setName(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="warning"
              className="mt-4 w-100"
              style={{ borderRadius: '12px', padding: '0.75rem' }}
              onClick={registerUser}
            >
              Register
            </Button>
          </Card.Body>
        </Card>

        <Card className="mb-4 shadow-sm border-0" style={{ borderRadius: '16px' }}>
          <Card.Body>
            <h4 style={{ fontWeight: 500 }}>🔍 Fetch User Profile</h4>
            <Form.Group className="mt-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g., 1"
                onChange={e => setUserId(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="success"
              className="mt-4 w-100"
              style={{ borderRadius: '12px', padding: '0.75rem' }}
              onClick={fetchProfile}
            >
              Fetch Profile
            </Button>

            {userData && (
              <div className="mt-4 bg-light p-3 rounded" style={{ fontSize: '1.05rem' }}>
                <strong>Name:</strong> {userData}
              </div>
            )}
          </Card.Body>
        </Card>

        {message && (
          <Alert
            variant={
              message.startsWith('🎉') ? 'success' : message.startsWith('⚠️') ? 'warning' : 'danger'
            }
            className="text-center"
            style={{ borderRadius: '12px', fontSize: '1rem' }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}