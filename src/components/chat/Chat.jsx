// import "./chat.css"
// import EmojiPicker from "emoji-picker-react"
// import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
// import { useState, useRef, useEffect } from 'react'
// import { db } from "../../lib/firebase"
// import { useChatStore } from "../../lib/chatStore"
// import { useUserStore } from "../../lib/userStore"
// import React from "react";

// const Chat = () => {
//     const [chat, setChat] = useState()
//     const [open, setOpen] = useState(false)
//     const [text, setText] = useState("")
//     const [cooldownActive, setCooldownActive] = useState(false);
    
//     const { currentUser } = useUserStore()
//     const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

//     const endRef = useRef(null)

//     useEffect(() => {
//         endRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, [chat?.messages])

//     useEffect(() => {
//         setChat(null); // Reset chat state when switching users
//         if (!chatId) return; // Prevent unnecessary fetches
    
//         const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
//             setChat(res.data());
//         });
    
//         return () => unSub();
//     }, [chatId]);
    
//     const handleEmoji = e => {
//         setText((prev) => prev + e.emoji)
//         setOpen(false)
//     }

//     const lastSentTimeRef = useRef(0);
//     const cooldownTime = 1500; // 1.5 seconds cooldown

//     const handleSend = async () => {
//         if (text === "" || cooldownActive) return;
    
//         const now = Date.now();
//         if (now - lastSentTimeRef.current < cooldownTime) {
//             setCooldownActive(true);
//             setText("");
    
//             setTimeout(() => {
//                 setCooldownActive(false);
//             }, cooldownTime);
    
//             return;
//         }
    
//         try {
//             await updateDoc(doc(db, "chats", chatId), {
//                 messages: arrayUnion({
//                     senderId: currentUser.id,
//                     text,
//                     createdAt: new Date(),
//                 }),
//             });
    
//             const userIDs = [currentUser.id, user.id];
    
//             userIDs.forEach(async (id) => {
//                 const userChatsRef = doc(db, "userchats", id);
//                 const userChatsSnapshot = await getDoc(userChatsRef);
    
//                 if (userChatsSnapshot.exists()) {
//                     const userChatsData = userChatsSnapshot.data();
    
//                     const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
    
//                     if (chatIndex !== -1) {
//                         userChatsData.chats[chatIndex].lastMessage = text;
//                         userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
//                         userChatsData.chats[chatIndex].updatedAt = Date.now();
    
//                         await updateDoc(userChatsRef, {
//                             chats: userChatsData.chats,
//                         });
//                     }
//                 }
//             });
    
//             lastSentTimeRef.current = now; // Update cooldown time reference
//             setText(""); // Clear input field
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     return (
//         <div className='chat'>
//             <div className="top">
//                 <div className="user">
//                     <div className="texts">
//                         <span>{user?.username}</span>
//                     </div>
//                 </div>
//             </div>
//             <div className="center">
//                 <div className="MessageStarter">Start of your chat</div>
//                 {chat?.messages?.map((message, index) => {
//                     const currentMessageDate = message.createdAt?.seconds 
//                         ? new Date(message.createdAt.seconds * 1000).toLocaleDateString() 
//                         : null;
//                     const previousMessageDate = index > 0 && chat.messages[index - 1].createdAt?.seconds
//                         ? new Date(chat.messages[index - 1].createdAt.seconds * 1000).toLocaleDateString()
//                         : null;

//                     return (
//                         <React.Fragment key={message?.createdAt?.seconds || index}>
//                             {currentMessageDate !== previousMessageDate && (
//                                 <div className="date-separator">{currentMessageDate}</div>
//                             )}
//                             <div className={`message ${message.senderId === currentUser.id ? "own" : ""}`}>
//                                 <div className="texts">
//                                     <p>{message.text}</p>
//                                     <span>
//                                         {message.createdAt?.seconds 
//                                             ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
//                                             : "Unknown Time"}
//                                     </span>
//                                 </div>
//                             </div>
//                         </React.Fragment>
//                     );
//                 })}
//                 <div ref={endRef}></div>
//             </div>
//             <div className="bottom">
//                 <input 
//                     type="text" 
//                     placeholder={cooldownActive ? "Wait before sending another message..." : (isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
//                     value={text}
//                     onChange={(e) => setText(e.target.value)}
//                     disabled={cooldownActive || isCurrentUserBlocked || isReceiverBlocked}
//                     className={cooldownActive ? "cooldown" : ""}
//                     onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 />
//                 <div className="emoji">
//                     <img 
//                         src="./emoji.png" 
//                         alt="emoji"
//                         onClick={() => setOpen((prev) => !prev)}
//                     />
//                     {open && (
//                         <div className="picker">
//                             <EmojiPicker open={open} onEmojiClick={handleEmoji} />
//                         </div>
//                     )}
//                 </div>
//                 <button className="sendButton" onClick={handleSend} disabled={cooldownActive || isCurrentUserBlocked || isReceiverBlocked}>
//                     Send
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Chat;

import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useState, useRef, useEffect } from 'react';
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { Button } from "react-bootstrap";
import React from "react";

const Chat = ({ openDetail, goBackToChatList }) => {
    const [chat, setChat] = useState();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [cooldownActive, setCooldownActive] = useState(false);

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const endRef = useRef(null);
    const emojiRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat?.messages]);

    useEffect(() => {
        setChat(null);
        if (!chatId) return;

        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });

        return () => unSub();
    }, [chatId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
        setOpen(false);
    };

    const handleSend = async () => {
        if (text === "" || cooldownActive) return;

        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });

            setText("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <Button variant="link" onClick={openDetail} className="user-button">
                        {user?.username}
                    </Button>
                    <Button variant="secondary" onClick={goBackToChatList} className="back-button d-md-none">
                        Back
                    </Button>
                </div>
            </div>
            <div className="center">
                {chat?.messages?.map((message, index) => (
                    <div key={index} className={`message ${message.senderId === currentUser.id ? "own" : ""}`}>
                        <div className="texts">
                            <p>{message.text}</p>
                            <span>
                                {message.createdAt?.seconds 
                                    ? new Date(message.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                                    : "Unknown Time"}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <input 
                    type="text" 
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <div className="emoji" ref={emojiRef}>
                    <img 
                        src="./emoji.png" 
                        alt="emoji"
                        onClick={() => setOpen((prev) => !prev)}
                    />
                    {open && (
                        <div className="picker">
                            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                        </div>
                    )}
                </div>
                <button className="sendButton d-none d-md-block" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
