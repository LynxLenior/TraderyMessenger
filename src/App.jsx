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
import { Routes, Route, Navigate, useParams } from "react-router-dom";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState("list"); // "list" | "chat" | "detail"

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
      <Route path="admin" element={isAdmin ? <Admin /> : <Navigate to="" />} />

      {/* Messenger as the main page */}
      <Route
        path=":id"
        element={
          <div className="container">
            {currentUser ? (
              <>
                {/* Show only one section at a time on mobile */}
                <div className={`chat-container ${activeSection}`}>
                  {activeSection === "list" && (
                    <List onSelectChat={() => setActiveSection("chat")} />
                  )}

                  {activeSection === "chat" && chatId && (
                    <Chat
                      onShowDetails={() => setActiveSection("detail")}
                      onBack={() => setActiveSection("list")}
                    />
                  )}

                  {activeSection === "detail" && chatId && (
                    <Detail onBack={() => setActiveSection("chat")} />
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
