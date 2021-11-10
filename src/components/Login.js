import React, { useState } from 'react';
import PropTypes from 'prop-types';
//import './login.css';


async function loginUser(credentials) {
  return fetch('https://localhost:44354/api/Users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}

export default function Login({ setToken }) {
  const [email, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password
    });
    if (token) {
      localStorage.setItem('token', token.accessToken);
      localStorage.setItem('userId', token.userId);
      setToken(token);
    }
  }

  return (

    <div className="login">
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label><br />
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button variant="dark" type="submit">Submit</button>

        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};