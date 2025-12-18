// // src/components/debug/AuthDebug.jsx
// import React from 'react';
// import { authService } from '../../services/AuthService';

// const AuthDebug = () => {
//   const token = authService.getToken();
//   const user = authService.getStoredUser();
//   const isAuthenticated = authService.isAuthenticated();

//   console.log('🔐 Auth Debug:', {
//     isAuthenticated,
//     token: token ? 'Present' : 'Missing',
//     user: user
//   });

//   return (
//     <div className="fixed top-4 left-4 bg-yellow-100 border border-yellow-400 p-4 rounded-lg text-sm z-50">
//       <h3 className="font-bold">Auth Status</h3>
//       <p>Authenticated: {isAuthenticated ? '✅' : '❌'}</p>
//       <p>Token: {token ? '✅' : '❌'}</p>
//       <p>User: {user ? user.name : 'None'}</p>
//     </div>
//   );
// };

// export default AuthDebug;