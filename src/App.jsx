// import { useEffect, useState } from "react";
// import Chat from "./components/chat/Chat";
// import Detail from "./components/detail/Detail";
// import List from "./components/list/List";
// import Login from "./components/login/Login";
// import Notification from "./components/notification/Notification";
// import Admin from "./components/admin/Admin";
// import { auth } from "./lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { useUserStore } from "./lib/userStore";
// import { useChatStore } from "./lib/chatStore";
// import { Routes, Route, Navigate, useParams } from "react-router-dom";


// function App() {
//   const { currentUser, isLoading, fetchUserInfo } = useUserStore();
//   const { chatId } = useChatStore();
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const unSub = onAuthStateChanged(auth, (user) => {
//       fetchUserInfo(user?.uid);
//       setIsAdmin(user?.email === "bagus.anselliam@ue.edu.ph");
//     });

//     return () => unSub();
//   }, [fetchUserInfo]);

//   if (isLoading) return <div className="loading">Loading...</div>;

//   return (
//     <Routes>
//       {/* Admin route */}
//       <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />
  
//       {/* Messenger as the main page */}
//       <Route
//         path=":id"
//         element={
//           <div className="container">
//             {currentUser ? (
//               <>
//                 <List />
//                 {chatId && <Chat />}
//                 {chatId && <Detail />}
//               </>
//             ) : (
//               <Login />
//             )}
//             <Notification />
//           </div>
//         }
//       />
//     </Routes>
//   );  
// };

// export default App;

import { useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import Admin from "./components/admin/Admin";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./lib/userStore";
import { useChatStore } from "./lib/chatStore";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      setIsAdmin(user?.email === "bagus.anselliam@ue.edu.ph");
    });

    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <Routes>
      {/* Admin route */}
      <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="/" />} />

      {/* Messenger as the main page */}
      <Route
        path=":id"
        element={
          <div className="container">
            {currentUser ? (
              <>
                <div className="row">
                  {/* Chat List (Mobile only) */}
                  <div className="col-12 d-md-none">
                    <List />
                  </div>

                  {/* Chat and Detail for Mobile */}
                  {chatId && (
                    <>
                      <div className="col-12 d-md-none">
                        <Chat />
                      </div>
                      <div className="col-12 d-md-none">
                        <Detail />
                      </div>
                    </>
                  )}

                  {/* Chat List for Desktop */}
                  <div className="col-md-4 d-none d-md-block">
                    <List />
                  </div>

                  {/* Chat and Detail for Desktop */}
                  {chatId && (
                    <>
                      <div className="col-md-8 d-none d-md-block">
                        <Chat />
                      </div>
                      <div className="col-md-8 d-none d-md-block">
                        <Detail />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Login />
            )}
            <Notification />
          </div>
        }
      />
    </Routes>
  );
}

export default App;


