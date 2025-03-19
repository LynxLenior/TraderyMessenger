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
// import { Routes, Route, Navigate } from "react-router-dom";
// import { Row, Col } from "react-bootstrap";

// export const switchGrid = (gridNumber) => {
//   setCurrentGrid(gridNumber);
// };

// function App() {
//   const { currentUser, isLoading, fetchUserInfo } = useUserStore();
//   const { chatId } = useChatStore();
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [currentGrid, setCurrentGrid] = useState(1);
  
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
//                 <Row>
//                   <Col xs={12} md={4} className={currentGrid === 1 ? "d-block" : "d-none"}>
//                     <List switchGrid={switchGrid} />
//                   </Col>
//                   <Col xs={12} md={4} className={currentGrid === 2 ? "d-block" : "d-none"}>
//                     <Button variant="outline-light" onClick={() => switchGrid(1)} className="Backbtn">Back</Button>
//                     {chatId && <Chat />}
//                   </Col>
//                   <Col xs={12} md={4} className={currentGrid === 3 ? "d-block" : "d-none"}>
//                     <Button variant="outline-light" onClick={() => switchGrid(2)} className="Backbtn">Back</Button>
//                     {chatId && <Detail />}
//                   </Col>
//                 </Row>
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
// }

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
import { Container, Row, Col, Modal, CloseButton, Button } from "react-bootstrap";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, changeChat } = useChatStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      setIsAdmin(user?.email === "bagus.anselliam@ue.edu.ph");
    });

    return () => unSub();
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <Container fluid className="app-container">
      <Routes>
        <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />

        <Route
          path=":id"
          element={
            <Row className="app-content">
              {currentUser ? (
                <>
                  {/* Chat List - Hidden on Mobile if Chat is Open */}
                  {showChatList && (
                    <Col xs={12} md={4} className="list-container">
                      <List onChatSelect={() => setShowChatList(false)} />
                    </Col>
                  )}

                  {/* Chat Section - Full Width on Mobile when Open */}
                  {chatId && (
                    <Col xs={12} md={8} className="chat-container">
                      <Chat
                        openDetail={() => setShowDetail(true)}
                        goBackToChatList={() => setShowChatList(true)}
                      />
                    </Col>
                  )}

                  {/* Detail Modal for Both Mobile and Desktop */}
                  <Modal show={showDetail} onHide={() => setShowDetail(false)} centered>
                    <Modal.Header>
                      <CloseButton onClick={() => setShowDetail(false)} />
                    </Modal.Header>
                    <Modal.Body>
                      <Detail />
                    </Modal.Body>
                  </Modal>
                </>
              ) : (
                <Login />
              )}
              <Notification />
            </Row>
          }
        />
      </Routes>
    </Container>
  );
}

export default App;