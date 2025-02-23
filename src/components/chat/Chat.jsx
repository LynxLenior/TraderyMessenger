import "./chat.css"
import EmojiPicker from "emoji-picker-react"
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { useState, useRef, useEffect } from 'react'
import { db } from "../../lib/firebase"
import { useChatStore } from "../../lib/chatStore"
import { useUserStore } from "../../lib/userStore"
import React from "react";

const Chat = () => {
    const [chat, setChat] = useState()
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    
    const { currentUser } = useUserStore()
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore()

    const endRef = useRef(null)

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth"})
    }, [chat?.messages])

    useEffect(() => {
        setChat(null); // Reset chat state when switching users
        if (!chatId) return; // Prevent unnecessary fetches
    
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });
    
        return () => unSub();
    }, [chatId]);
    
    const handleEmoji = e =>{
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }

    const [lastSentTime, setLastSentTime] = useState(0);
    const cooldownTime = 3000; // 3 seconds cooldown

    const handleSend = async () => {
        if (text === "") return;
    
        const now = Date.now();
        if (now - lastSentTime < cooldownTime) {
            console.log("Please wait before sending another message.");
            return;
        }
    
        try {
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });
    
            const userIDs = [currentUser.id, user.id];
    
            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);
    
                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();
    
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId);
    
                    if (chatIndex !== -1) {
                        userChatsData.chats[chatIndex].lastMessage = text;
                        userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
                        userChatsData.chats[chatIndex].updatedAt = Date.now();
    
                        await updateDoc(userChatsRef, {
                            chats: userChatsData.chats,
                        });
                    }
                }
            });
    
            setLastSentTime(now); // Update last sent time
            setText(""); // Clear input field
        } catch (err) {
            console.log(err);
        }
    };
        setText("")
    }

  return (
    <div className='chat'>
        <div className="top">
            <div className="user">
                <div className="texts">
                    <span>{user?.username}</span>
                </div>
            </div>
        </div>
        <div className="center">
        <div className="MessageStarter">-------------------------------- Start of your chat -----------------------------</div>
        {chat?.messages?.map((message, index) => {
            const currentMessageDate = new Date(message.createdAt?.seconds * 1000).toLocaleDateString();
            const previousMessageDate = index > 0 
                ? new Date(chat.messages[index - 1].createdAt?.seconds * 1000).toLocaleDateString() 
                : null;

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
                            <span>{new Date(message.createdAt?.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isCurrentUserBlocked || isReceiverBlocked}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
            <div className="emoji">
                <img 
                    src="./emoji.png" 
                    alt=""
                    onClick={() => setOpen((prev) => !prev)}
                />
                <div className="picker">
                <EmojiPicker open={open} onEmojiClick={handleEmoji} />
                </div>
            </div>
            <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>
                Send
                </button>
        </div>
    </div>
  )
}

export default Chat