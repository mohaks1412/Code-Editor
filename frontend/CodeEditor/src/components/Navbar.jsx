import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {

  const userState = useSelector((state) => state.user.id); // or id depending on your slice
  console.log("Navbar user state:", userState);
  
  const isLoggedIn = Boolean(userState);

  const navItems = [
    { name: 'Home', slug: '/', active: true },
    { name: 'My Projects', slug: '/my-projects', active: isLoggedIn},
    { name: 'New Project', slug: '/new-project', active: isLoggedIn},
    {name: 'Join Project', slug: '/join-project', active: isLoggedIn},
  ]
    
  
  const authItems = [
    { name: 'Login', slug: '/login', active: !isLoggedIn },
    { name: 'Signup', slug: '/signup', active: !isLoggedIn },
    {name: 'User Profile', slug: 'user-profile', active: isLoggedIn},
    {name: 'Logout', slug: '/logout', active : isLoggedIn}
  ];

  return (
    <div className="navbar-container">
      <nav>
        <ul className="nav-left">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {item.name}
                  </NavLink>
                </li>
              )
          )}
        </ul>

        <ul className="nav-right">
          {authItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    {item.name}
                  </NavLink>
                </li>
              )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
