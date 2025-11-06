import React, { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';

export const LoginPage = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const onSubmitHandler = (event) => {
      event.preventDefault();
      props.loginHandler(username, password);
    }
  
    const onChangeUsername = (event) => {
      setUsername(event.target.value);
    }
  
    const onChangePassword = (event) => {
      setPassword(event.target.value);
    }
  
    return (
      <div id="login-page">
        <div id="login">
          <Logo />
          <Notif message={props.notif.message} style={props.notif.style} />
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="username">Username</label>
            <input id="username" autoComplete="off" onChange={onChangeUsername}  value={username} type="text" />
            <label htmlFor="password">Password</label>
            <input id="password" autoComplete="off" onChange={onChangePassword} value={password} type="password" />
            <button 
              type="submit" 
              className="auth-button primary-action"
              data-testid="auth-submit"
              data-action="authenticate"
              data-tracking="user-auth-btn"
              aria-label="Sign in to your account"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <span role="img" aria-label="sparkles">✨</span>
              <span>Continue to Account</span>
            </button>
          </form>
        </div>
      </div>
    )
}
