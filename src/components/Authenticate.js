import React, {useState, useEffect} from 'react';
import DATA from '../data';
import { Dashboard } from './Dashboard';
import { LoginPage } from './LoginPage';
import { ClientDashboard } from './ClientDashboard';

export const Authenticate = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [notif, setNotif] = useState({message: '', style: ''});
    const [isAdmin, setIsAdmin] = useState(false);
    const [client, setClient] = useState(null);
    const localUsers = localStorage.getItem('users');
    
    if(!localUsers) {
      localStorage.setItem('users', JSON.stringify(DATA));
    }

    const clients = JSON.parse(localStorage.getItem('users'));

    // Restore session from localStorage if available
    useEffect(() => {
      const saved = localStorage.getItem('currentUser');
      if (saved) {
        const savedUser = JSON.parse(saved);
        const latestUsers = JSON.parse(localStorage.getItem('users')) || [];
        // Find the freshest record in local storage by unique id (email or number)
        const liveUser = latestUsers.find(u => u.email === savedUser.email || u.number === savedUser.number) || savedUser;
        setClient(liveUser);
        setIsAdmin(!!liveUser.isAdmin);
        setIsLoggedIn(true);
      }
    }, []);

    const isLoginSuccess = (email, password) => {
      let isFound = false;

      clients.forEach(user => {
        if(user.email === email && user.password === password) {
          if(user.isAdmin) {
            setIsAdmin(true);
            setClient(user);
            isFound = true;
          }
          else {
            setIsAdmin(false);
            setClient(user)
            isFound = true;
          }
          setNotif('');
        }
      });
  
      if(!isFound) setNotif({message: 'Wrong username and password.', style: 'danger'});
      return isFound;
    }
  
    const login = (username, password) => {
        if(isLoginSuccess(username, password)) {
            setIsLoggedIn(true);
        }
    }
  
    const logout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('currentUser');
        setNotif({message: 'You have logged out.', style: 'success'});
    }
  
    if(isLoggedIn) {
      localStorage.setItem('currentUser', JSON.stringify(client));
      if(isAdmin) {
        return <Dashboard users={clients} logoutHandler={logout} />
      } else {
        
        return <ClientDashboard client={client} users={clients} setClient={setClient} logout={logout} />
      }
    } else {
      return <LoginPage loginHandler={login} notif={notif} isLoggedIn={isLoggedIn} />
    }
}
