import { useState } from "react";
import "./ResponsiveChat.css";
import { useChatStore } from "../../lib/chatStore";

const ResponsiveChat = ({ chats, onSelectChat }) => {
    const { chatId } = useChatStore();
    const [showChat, setShowChat] = useState(false);

    const handleChatSelect = (chat) => {
        onSelectChat(chat);
        setShowChat(true);
    };

    return (
        <div className="responsiveChat">
            {!showChat ? (
                // Show Chat List
                <div className="chatList">
                    <h2>Chats</h2>
                    {chats.map((chat) => (
                        <div
                            className="chatItem"
                            key={chat.chatId}
                            onClick={() => handleChatSelect(chat)}
                        >
                            <div className="chatTexts">
                                <span>{chat.user.username}</span>
                                <p>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Show Chat Details
                <div className="chatDetail">
                    <button className="backButton" onClick={() => setShowChat(false)}>
                        ← Back
                    </button>
                    <h2>Chat with {chatId}</h2>
                    {/* Chat messages & input field can be added here */}
                </div>
            )}
        </div>
    );
};

export default ResponsiveChat;
