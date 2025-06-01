'use client';
import { useState } from 'react';
import axios from 'axios';
import {Container, Form, Button, Card, Row, Col, Alert} from 'react-bootstrap';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    primaryMajor: '',
    secondaryMajor: '',
    minor1: '',
    minor2: '',
    completedModules: '',
    currentSemester: '',
    internshipSem: '',
  });
  const [message, setMessage] = useState('');

  const backendUrl = 'http://localhost:5000';

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${backendUrl}/profile/userProfile`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      setMessage('🎉 Profile saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to save profile.');
    }
  };

  return (
    <div
      style={{
        background: '#f9f9fb',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
      }}
    >
      <Container style={{ maxWidth: '650px' }}>
        <h1
          className="mb-4"
          style={{
            fontFamily: `'Georgia', 'Times New Roman', serif`,
            fontWeight: 'bold',
            fontSize: '2.5rem',
            color: '#1a1a1a',
            textAlign: 'center',
          }}
        >
          Academic Profile
        </h1>

        <Card className="shadow-sm border-0 mb-4" style={{ borderRadius: '16px' }}>
          <Card.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Major</Form.Label>
                    <Form.Control
                      type="text"
                      name="primaryMajor"
                      placeholder="e.g., Computer Science"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Secondary Major</Form.Label>
                    <Form.Control
                      type="text"
                      name="secondaryMajor"
                      placeholder="(Optional)"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Minor 1</Form.Label>
                    <Form.Control
                      type="text"
                      name="minor1"
                      placeholder="e.g., Data Science"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Minor 2</Form.Label>
                    <Form.Control
                      type="text"
                      name="minor2"
                      placeholder="(Optional)"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Completed Modules</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="completedModules"
                  placeholder="e.g., CS1010, MA1521, GER1000"
                  onChange={handleChange}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Semester</Form.Label>
                    <Form.Control
                      type="number"
                      name="currentSemester"
                      placeholder="e.g., 4"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Internship Semester</Form.Label>
                    <Form.Control
                      type="number"
                      name="internshipSem"
                      placeholder="e.g., 5 (if applicable)"
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="warning"
                className="mt-3 w-100"
                style={{ borderRadius: '12px', padding: '0.75rem' }}
                onClick={handleSubmit}
              >
                💾 Save Profile
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {message && (
          <Alert
            variant={message.includes('🎉') ? 'success' : 'danger'}
            className="text-center"
            style={{ borderRadius: '12px' }}
          >
            {message}
          </Alert>
        )}
      </Container>
    </div>
  );
}
