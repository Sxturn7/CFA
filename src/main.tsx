import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
//import './index.css';

createRoot(document.getElementById('root')).render(
  <div style={{
    background: 'black',
    color: 'red',
    fontSize: '50px',
    height: '100vh'
  }}>
    ROOT WORKING
  </div>
