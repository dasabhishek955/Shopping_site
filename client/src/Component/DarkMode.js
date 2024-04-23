import React, { useState, useEffect } from 'react';
import './DarkMode.css';


function DarkMode() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ? true : false
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

  };

  return (
    <div className="dark-mode-toggle">
      <input type="checkbox" id="toggle" checked={darkMode} onChange={toggleDarkMode} />
      <label htmlFor="toggle" className={`dark-mode-label ${darkMode ? 'active' : ''}`}>
        <img src="/sun.png" alt="Sun" className="sun" />
        <img src="/moon.png" alt="Moon" className="moon" />
      </label>
    </div>
  );
}

export default DarkMode;


{/* 
// import React, { useState, useEffect } from 'react';

// function DarkMode() {
//   const [darkMode, setDarkMode] = useState(getInitialMode());

//   function getInitialMode() {
//     const savedMode = localStorage.getItem('darkMode');
//     if (savedMode !== null) {
//       return savedMode === 'true';
//     }
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       return true;
//     }
//     return false;
//   }

//   const toggleDarkMode = () => {
//     if (!darkMode) {
//       setDarkMode(true);
//     }
//     else {
//       setDarkMode(false);
//     }
//   };

//   const handleSystemMode = () => {
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     setDarkMode(systemPrefersDark);
//   };

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark-mode');
//     } else {
//       document.documentElement.classList.remove('dark-mode');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   return (
//     <div>
//       <button onClick={toggleDarkMode} className={`mode-button ${darkMode ? 'active' : ''}`}>
//         Dark
//       </button>
//       <button onClick={handleSystemMode} className="mode-button">
//         System
//       </button>
//       <button onClick={toggleDarkMode} className={`mode-button ${!darkMode ? 'active' : ''}`}>
//         Light
//       </button>
//     </div>
//   );
// }

// export default DarkMode;

// import React, { useState, useEffect } from 'react';
// import './DarkMode1.css';

// function DarkMode() {
//   const [darkMode, setDarkMode] = useState(getInitialMode());

//   function getInitialMode() {
//     const savedMode = localStorage.getItem('darkMode');
//     if (savedMode !== null) {
//       return savedMode === 'true';
//     }
//     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       return true;
//     }
//     return false;
//   }

//   const toggleDarkMode = () => {
//     setDarkMode(prevMode => !prevMode);
//   };

//   const handleSystemMode = () => {
//     const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (!localStorage.getItem('darkMode')) {
//       setDarkMode(systemPrefersDark);
//     }
//     localStorage.removeItem('darkMode');
//   };

//   useEffect(() => {
//     const darkModeListener = (e) => {
//       if (!localStorage.getItem('darkMode')) {
//         setDarkMode(e.matches);
//       }
//     };

//     const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     darkModeMediaQuery.addListener(darkModeListener);

//     return () => {
//       darkModeMediaQuery.removeListener(darkModeListener);
//     };
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark-mode');
//     } else {
//       document.documentElement.classList.remove('dark-mode');
//     }
//     localStorage.setItem('darkMode', darkMode);
//   }, [darkMode]);

//   return (
//     <div className="dropdown">
//       <button className="dropbtn">Theme</button>
//       <div className="dropdown-content">
//         <button onClick={toggleDarkMode} className={`mode-button ${darkMode ? 'active' : ''}`}>
//           Dark
//         </button>
//         <button onClick={handleSystemMode} className="mode-button">
//           System
//         </button>
//         <button onClick={() => setDarkMode(false)} className={`mode-button ${!darkMode ? 'active' : ''}`}>
//           Light
//         </button>
//       </div>
//     </div>
//   );
// }

// export default DarkMode;
 */}
