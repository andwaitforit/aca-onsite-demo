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
    event.stopPropagation();
    const value = event.target.value;
    console.log('Username changed:', value);
    setUsername(value);
  }

  const onChangePassword = (event) => {
    event.stopPropagation();
    const value = event.target.value;
    console.log('Password changed:', value);
    setPassword(value);
  }
  
    return (
      <div id="login-page">
        <div id="login">
          <Logo />
          <Notif message={props.notif.message} style={props.notif.style} />
          <form onSubmit={onSubmitHandler}>
            <label htmlFor="username">Username</label>
            <input 
              id="username" 
              autoComplete="off" 
              onChange={onChangeUsername}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              value={username} 
              type="text"
              style={{ pointerEvents: 'auto', cursor: 'text' }}
            />
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              autoComplete="off" 
              onChange={onChangePassword}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              value={password} 
              type="password"
              style={{ pointerEvents: 'auto', cursor: 'text' }}
            />
            <button 
              type="submit" 
              className="btn auth-button primary-action"
              data-testid="auth-submit"
              data-action="authenticate"
              data-tracking="user-auth-btn"
              aria-label="Sign in to your account"
            >
              <span role="img" aria-label="sparkles">✨</span>
              <span>Login</span>
            </button>
          </form>
        </div>
      </div>
    )
}
