import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, onSnapshot, updateDoc, writeBatch } from "firebase/firestore";
import { useState, useRef, useEffect } from "react";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import React from "react";

const Chat = () => {
    const [chat, setChat] = useState(null);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

    const endRef = useRef(null);

    // Auto-scroll to the latest message
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

    // Listen for chat updates
    useEffect(() => {
        if (!chatId) return;

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data() || { messages: [] });
        });

        return () => unSub();
    }, [chatId]);

    // Handle emoji selection
    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    // Handle message sending
    const handleSend = async () => {
        if (!text.trim() || isCurrentUserBlocked || isReceiverBlocked) return;

        try {
            const chatRef = doc(db, "chats", chatId);
            const batch = writeBatch(db);

            batch.update(chatRef, {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });

            const userIDs = [currentUser.id, user.id];
            userIDs.forEach((id) => {
                const userChatsRef = doc(db, "userchats", id);
                batch.update(userChatsRef, {
                    chats: user.chats.map((c) =>
                        c.chatId === chatId
                            ? {
                                  ...c,
                                  lastMessage: text,
                                  isSeen: id === currentUser.id,
                                  updatedAt: Date.now(),
                              }
                            : c
                    ),
                });
            });

            await batch.commit();
        } catch (err) {
            console.error("Error sending message:", err);
        }

        setText("");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <div className="texts">
                        <span>{user?.username}</span>
                    </div>
                </div>
            </div>
            <div className="center">
                <div className="MessageStarter">
                    -------------------------------- Start of your chat -----------------------------
                </div>
                {chat?.messages?.map((message, index) => {
                    const currentMessageDate = new Date(message.createdAt?.seconds * 1000).toLocaleDateString();
                    const previousMessageDate =
                        index > 0 ? new Date(chat.messages[index - 1].createdAt?.seconds * 1000).toLocaleDateString() : null;

                    return (
                        <React.Fragment key={message?.createdAt?.seconds}>
                            {currentMessageDate !== previousMessageDate && (
                                <div className="date-separator">
                                    --------------------------------- {currentMessageDate} -----------------------------
                                </div>
                            )}
                            <div className={`message ${message.senderId === currentUser.id ? "own" : ""}`}>
                                <div className="texts">
                                    <p>{message.text}</p>
                                    <span>
                                        {new Date(message.createdAt?.seconds * 1000).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <input
                    type="text"
                    placeholder={
                        isCurrentUserBlocked || isReceiverBlocked
                            ? "You cannot send a message"
                            : "Type a message..."
                    }
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="emoji">
                    <img src="./emoji.png" alt="" onClick={() => setOpen((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;