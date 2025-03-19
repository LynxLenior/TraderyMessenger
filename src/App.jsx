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
  const [visibleGrid, setVisibleGrid] = useState(1); // Track the visible grid
  const [isMobile, setIsMobile] = useState(false); // Detect mobile screen size

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Check for mobile size (<= 768px)
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      setIsAdmin(user?.email === "bagus.anselliam@ue.edu.ph");
    });

    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  // Handle Grid Toggle (only for mobile)
  const handleClick = () => {
    if (isMobile) {
      setVisibleGrid(visibleGrid === 1 ? 2 : 1); // Toggle between grid 1 and grid 2
    }
  };

  return (
    <Routes>
      {/* Admin route */}
      <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />

      {/* Messenger as the main page */}
      <Route
        path=":id"
        element={
          <div className="container">
            {currentUser ? (
              <>
                {/* Left - List */}
                <div className={visibleGrid === 1 ? "" : "d-none"}>
                  <List handleClick={handleClick} />
                </div>

                {/* Center - Chat */}
                <div className={visibleGrid === 2 ? "" : "d-none"}>
                  {chatId && <Chat />}
                </div>

                {/* Right - Detail */}
                <div className={visibleGrid === 3 ? "" : "d-none"}>
                  {chatId && <Detail />}
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