'use client';
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';

function BasicExample() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/me', { withCredentials: true })
      .then(res => {
        if (res.data && res.data.logged_in) {
          setIsLoggedIn(true);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} href="/">ModulusAI</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isLoggedIn && (
              <>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
              </>
            )}
            {isLoggedIn && (
              <>
            <Nav.Link href="/profile">My Profile</Nav.Link>
            <Nav.Link href="/timetable">My Timetable</Nav.Link>
            <Nav.Link href="/degree">Degree Progress</Nav.Link>
            <NavDropdown title="Features" id="basic-nav-dropdown">
              <NavDropdown.Item href="/chat">Chatbot</NavDropdown.Item>
              <NavDropdown.Item href="/sentiment">Sentiment Analysis</NavDropdown.Item>
              <NavDropdown.Item href="/optimizer">Semester Scheduler</NavDropdown.Item>
            </NavDropdown>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <header> {BasicExample()}</header>
      <body>
        {children}
      </body>
    </html>
  );
}
