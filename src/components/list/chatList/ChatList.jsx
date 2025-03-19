// import { useEffect, useState } from "react"
// import "./chatList.css"
// import AddUser from "./addUser/addUser";
// import { useUserStore } from "../../../lib/userStore";
// import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { useChatStore } from "../../../lib/chatStore";

// const ChatList = () => {
//     const [chats, setChats]= useState([]);
//     const [addMode, setAddMode]= useState(false);
//     const [input, setInput]= useState("");

//     const {currentUser} = useUserStore()
//     const { changeChat} = useChatStore()
    
//     useEffect(()=>{

//         if (!currentUser?.id) return

//         const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) =>{
//             const items = res.data().chats

//             const promises = items.map( async(item) =>{
//                 const userDocRef = doc(db, "users", item.receiverId)
//                 const userDocSnap = await getDoc(userDocRef)

//                 const user = userDocSnap.data()

//                 return {...item, user}
//             })

//             const chatData = await Promise.all(promises)

//             setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
//         })
    
//         return () => {
//             unSub()
//         }
//     }, [currentUser.id])

//     const handleSelect = async (chat) =>{
        
//         const userChats = chats.map(item=>{
//             const {user, ...rest } = item
//             return rest
//         })

//         const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId)

//         userChats[chatIndex].isSeen = true

//         const userChatsRef = doc(db, "userchats", currentUser.id)

        
//         try{
            
//             await updateDoc(userChatsRef,{
//                 chats:userChats, 
//             })
//             changeChat(chat.chatId,chat.user)
//         }catch(err){
//             console.log(err)
//         }
//     }

//     const filteredChats = chats.filter(c=> c.user.username.toLowerCase().includes(input.toLowerCase())
//     )

//   return (
//     <div className='chatList'>
//         <div className="search">
//             <div className="searchBar">
//                 <img src="./search.png" alt="" />
//                 <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}/>
//             </div>
//             <img src={addMode ? "./minus.png" : "./plus.png"} 
//             alt="" 
//             className="add" 
//             onClick={() => setAddMode((prev) => !prev)}
//             />
//         </div>
//         {filteredChats.map((chat) => (
//         <div 
//             className="item" 
//             key={chat.chatId} 
//             onClick={()=>handleSelect(chat)}
//             style={{
//                 backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
//             }}
//         >
//             <div className="texts">
//                 <span>{chat.user.blocked.includes(currentUser.id) 
//                 ? "User" 
//                 : chat.user.username}</span>
//                 <p>{chat.lastMessage}</p>
//             </div>
//         </div>
//     ))}
//         {addMode && <AddUser/>}
//     </div>
//   )
// }

// export default ChatList

import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore();
    const { changeChat } = useChatStore();
    
    useEffect(() => {
        if (!currentUser?.id) return;

        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });
    
        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {
        const userChats = chats.map(item => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

    return (
        <div className='chatList container-fluid p-3'>
            <div className='row'>
                <div className='col-12'>
                    <div className="search d-flex align-items-center gap-2 p-2">
                        <div className="searchBar flex-grow-1 d-flex align-items-center bg-dark rounded p-2">
                            <img src="./search.png" alt="" className="me-2" />
                            <input type="text" className="form-control bg-transparent border-0 text-white" placeholder="Search" onChange={(e) => setInput(e.target.value)} />
                        </div>
                        <img src={addMode ? "./minus.png" : "./plus.png"} 
                            alt="" 
                            className="add bg-dark p-2 rounded cursor-pointer" 
                            onClick={() => setAddMode((prev) => !prev)}
                        />
                    </div>
                </div>
                <div className='col-12'>
                    {filteredChats.map((chat) => (
                        <div className="item d-flex align-items-center gap-2 p-2 border-bottom" 
                            key={chat.chatId} 
                            onClick={() => handleSelect(chat)}
                            style={{
                                backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                            }}
                        >
                            <div className="texts d-flex flex-column overflow-hidden">
                                <span className="fw-bold">{chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}</span>
                                <p className="small text-truncate" style={{ maxWidth: "200px" }}>{chat.lastMessage}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {addMode && <AddUser />}
            </div>
        </div>
    );
};

export default ChatList;
