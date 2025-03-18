import { useState } from "react";
import ChatList from "../list/ChatList";
import Chat from "../chat/Chat";
import Detail from "../detail/Detail";
import "./ResponsiveChat.css";

const ResponsiveChat = () => {
    const [view, setView] = useState("list"); // "list", "chat", "detail"
    const [selectedChat, setSelectedChat] = useState(null);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setView("chat");
    };

    return (
        <div className="responsive-chat">
            {view === "list" && <ChatList onSelectChat={handleSelectChat} />}
            {view === "chat" && selectedChat && (
                <Chat chat={selectedChat} onBack={() => setView("list")} onOpenDetail={() => setView("detail")} />
            )}
            {view === "detail" && (
                <Detail chat={selectedChat} onBack={() => setView("chat")} />
            )}
        </div>
    );
};

export default ResponsiveChat;
