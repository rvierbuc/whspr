//root folder
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './style/style.scss';
import * as bootstrap from 'bootstrap';

const container = document.getElementById('app')!;

const root = createRoot(container);


root.render(<App />);