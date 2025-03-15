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
    <Routes>
      <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />

      <Route
        path=":id"
        element={
          <Container fluid className="container">
            {currentUser ? (
              <Row className="g-0">
                <Col xs={12} md={4} lg={3} className="p-2">
                  <List />
                </Col>

                {chatId && (
                  <>
                    <Col xs={12} md={8} lg={6} className="p-2">
                      <Chat />
                    </Col>
                    <Col xs={12} md={4} lg={3} className="p-2">
                      <Detail />
                    </Col>
                  </>
                )}
              </Row>
            ) : (
              <Login />
            )}
            <Notification />
          </Container>
        }
      />
    </Routes>
  );
}

export default App;
