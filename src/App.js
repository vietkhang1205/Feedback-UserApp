import logo from './logo.svg';
import './App.css';
import { Container, Typography } from "@material-ui/core";
import Order from "./components/Order";
import React, { useState } from 'react';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState();
  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <Container maxWidth="md">
      <Typography
      gutterBottom
      variant="h2"
      align ="center">
        Feedback's Facilities App
      </Typography>
      <Order />
    </Container>
  );
}

export default App;
