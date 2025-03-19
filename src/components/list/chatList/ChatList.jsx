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

const ChatList = ({ handleClick }) => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");
  const [isMobile, setIsMobile] = useState(false); // Track if the screen is mobile-sized

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Detect if the screen is mobile-sized
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size when the component mounts

    return () => window.removeEventListener("resize", handleResize); // Cleanup on unmount
  }, []);

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
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);

      // Only call handleClick if it's a mobile screen
      if (isMobile && handleClick) {
        handleClick(); // Trigger grid switch on mobile
      }
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter(
    (c) => c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>

      {filteredChats.map((chat) => (
        <div
          className="item"
          key={chat.chatId}
          onClick={() => handleSelect(chat)} // Call handleSelect on click
          style={{
            backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
          }}
        >
          <div className="texts">
            <span>
              {chat.user.blocked.includes(currentUser.id)
                ? "User"
                : chat.user.username}
            </span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;