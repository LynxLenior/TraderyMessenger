import React, { useState, useEffect } from "react";
import ChatList from "../list/ChatList"; 
import Chat from "../chat/Chat"; 
import Detail from "../detail/Detail"; 
import "./chatLayout.css"; 

const ChatLayout = () => {
    const [activeSection, setActiveSection] = useState("chatList");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Update screen size when window resizes
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="chat-container">
            {/* Desktop View: Show all sections */}
            {!isMobile ? (
                <>
                    <ChatList />
                    <Chat />
                    <Detail />
                </>
            ) : (
                // Mobile View: Show only one section at a time
                <div className="mobile-view">
                    {activeSection === "chatList" && (
                        <ChatList onSelectChat={() => setActiveSection("chat")} />
                    )}

                    {activeSection === "chat" && (
                        <Chat
                            onBack={() => setActiveSection("chatList")}
                            onOpenDetails={() => setActiveSection("details")}
                        />
                    )}

                    {activeSection === "details" && (
                        <Detail onBack={() => setActiveSection("chat")} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatLayout;
