import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';


export default function Navbar() {
  const navItems = [
    { label: 'New Scan', to: '/scan' },
    { label: 'Ai Interpreter', to: '/results' },
    { label: 'Advanced Scan', to: '/advanced' }
  ];

  return (
    <nav className="bg-[#0f172a] text-white shadow-md border-b-2 border-gray-600">
  <div className="flex justify-between items-center h-24 pr-6">
    {/* Logo + Title */}
    <div className="flex items-center space-x-3 -mt-2 pl-6">
      <FaShieldAlt size={32} className="text-blue-500" />
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span className="text-blue-500">Nessus</span>{' '}
        <span className="text-white">Automator</span>
      </h1>
    </div>

    {/* Navigation */}
    <ul className="flex space-x-6 text-lg font-medium">
      {navItems.map(({ label, to }) => (
        <li key={label}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `px-6 py-3 rounded-xl cursor-pointer transition transform shadow-md ${
                isActive
                  ? 'bg-blue-700 text-white scale-105'
                  : 'bg-gray-800 hover:bg-blue-700 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  </div>
</nav>

  );
}
