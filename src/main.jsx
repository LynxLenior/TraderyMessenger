import * as React from "react";
import * as ReactDOM from "react-dom/client";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'
import 'react-bootstrap'
import './index.css'
import App from './App.jsx'

import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

// const router = createHashRouter([
//   {
//     path: "/", element: <LoginPage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/Home", element: <HomePage />,
//     errorElement: <ErrorPage />,
//   },
//   {
//     path: "/Dashboard", element: <DBPage />,
//     children:[
//       {path: "/Dashboard/Profile", element: <Profile />},
//       {path: "/Dashboard/Messages", element: <Messages />},
//       {path: "/Dashboard/Post", element: <Post />},
//       {path: "/Dashboard/Items", element: <Items />},
//       {path: "/Dashboard/Requests", element: <Requests />},
//     ]
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
