import React from 'react';
import logo from './communityBank.svg';
import './Login.css';
import axios from 'axios';
export default function Login() {
  function login() {
    let { REACT_APP_DOMAIN, REACT_APP_CLIENT_ID } = process.env;

    let redirectUri = encodeURIComponent(`http://localhost:3005/auth/callback`);

    window.location = `https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&response_type=code`;
  }

  return (
    <div className="App">
      <img src={logo} alt="" />
      <button onClick={login}>Login</button>
    </div>
  );
}
