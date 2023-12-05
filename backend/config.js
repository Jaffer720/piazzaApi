// config.js
// module.exports = {
//     google: {
//       clientId: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       redirectUri: 'https://127.0.0.1:8000/auth',
//     },
//   };
import dotenv from "dotenv";
dotenv.config();

  
export const  config = {
    google: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: 'https://127.0.0.1:8000/oauth/',
    },
    ssl:{
      keyPath: 'D:/Projects/piazzaApi/backend/server.key',
      certPath: 'D:/Projects/piazzaApi/backend/server.cert',
    },
  };