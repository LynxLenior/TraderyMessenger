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
import { Container, Row, Col } from "react-bootstrap";

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
    <>
      <Notification />
      <Routes>
        <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />
  
        <Route
          path=":id"
          element={
            <Container fluid className="container">
              {currentUser ? (
                <Row className="g-0">
                  <Col xs={12} sm={4} md={3} className="p-2">
                    <List />
                  </Col>
  
                  <Col xs={12} sm={8} md={6} className={`p-2 ${chatId ? "" : "d-none d-sm-block"}`}>
                    {chatId ? <Chat /> : <div className="empty-chat">Select a chat to start messaging</div>}
                  </Col>
  
                  <Col xs={12} sm={12} md={3} className="p-2 d-none d-md-block">
                    <Detail />
                  </Col>
                </Row>
              ) : (
                <Login />
              )}
            </Container>
          }
        />
      </Routes>
    </>
  );
  
}

export default App;
