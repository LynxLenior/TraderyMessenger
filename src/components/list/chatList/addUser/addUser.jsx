import { useState } from "react"
import { db } from "../../../../lib/firebase"
import "./addUser.css"
import { 
  arrayUnion, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  serverTimestamp, 
  setDoc, 
  updateDoc, 
  where 
} from "firebase/firestore"
import { useUserStore } from "../../../../lib/userStore"

const AddUser = () => {
  const [user, setUser] = useState(null)
  const [added, setAdded] = useState(false) 
  const [error, setError] = useState(null) // For duplicate check error

  const { currentUser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null) // Reset error state

    const formData = new FormData(e.target)
    const username = formData.get("username")
    try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data())
        setAdded(false) // Reset added state when searching
      }
    } catch (err) {
      console.log(err)  
    }
  }

  const [showAddUser, setShowAddUser] = useState(true)

  const handleAdd = async () => {
    if (!user) return

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")
    const currentUserChatsRef = doc(userChatsRef, currentUser.id)

    try {
      // Fetch current user's chat list
      const currentUserChatsSnap = await getDoc(currentUserChatsRef)

      if (currentUserChatsSnap.exists()) {
        const chats = currentUserChatsSnap.data().chats || []
        
        // Check if user is already added
        const alreadyAdded = chats.some(chat => chat.receiverId === user.id)

        if (alreadyAdded) {
          setError("User already added!") // Show error if already in list
          return
        }
      }

      // Create new chat
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      })

      // Add user to both user's chat lists
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        })
      })

      await updateDoc(currentUserChatsRef, {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        })
      })


      setTimeout(() => setShowAddUser(false), 1000)

      console.log(newChatRef.id)
      setAdded(true) // Hide button after adding
      setError(null) // Clear any previous errors
    } catch (err) {
      console.log(err)
    }
  }

  return showAddUser ? (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button type="submit">Search</button>
      </form>

      {user && (
        <div className="user">
          <div className="detail">
            <span>{user.username}</span>
          </div>
          {!added && !error && <button onClick={handleAdd}>Add User</button>} 
          {added && <span>User Added ✅</span>} 
          {error && <span style={{ color: "red" }}>{error}</span>} 
        </div>
      )}
    </div>
  ) : null;
}
export default AddUser


// import { useState } from "react"
// import { db } from "../../../../lib/firebase"
// import "./addUser.css"
// import { 
//   arrayUnion,
//   collection,  
//   doc,  
//   getDocs, 
//   query, 
//   serverTimestamp, 
//   setDoc, 
//   updateDoc, 
//   where,
// } from "firebase/firestore"
// import { useUserStore } from "../../../../lib/userStore"


// const AddUser = () => {
//   const [user, setUser] = useState(null)
//   const [showAddUser, setShowAddUser] = useState(true)
//   const {currentUser} = useUserStore()

//   const handleSearch = async e=> {
//     e.preventDefault()
//     const formData = new FormData(e.target)
//     const username = formData.get("username")
    
//     try{
//       const userRef = collection(db, "users")

//       const q = query(userRef, where("username", "==", username))

//       const querySnapShot = await getDocs(q)

//       if(!querySnapShot.empty){
//         setUser(querySnapShot.docs[0].data())
//         setShowAddUser(false)
//       }
//     }catch(err) {
//     console.log(err)
//     }
//   }

//   const handleAdd = async () => {
//     const chatRef = collection(db, "chats")
//     const userChatsRef = collection(db, "userchats")

//     try {
//       const newChatRef = doc(chatRef)

//        await setDoc(newChatRef, {
//         createdAt: serverTimestamp(),
//         messages: [],
//       })

//       await updateDoc(doc(userChatsRef, user.id), {
//         chats:arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage:"",
//           receiverId: currentUser.id,
//           updatedAt: Date.now(),
//         })
//       })

//       await updateDoc(doc(userChatsRef, currentUser.id), {
//         chats:arrayUnion({
//           chatId: newChatRef.id,
//           lastMessage:"",
//           receiverId: user.id,
//           updatedAt: Date.now(),
//         })
//       })

//       console.log(newChatRef.id)
//     } catch (err) {
//       console.log(err)
//     }
//   }

//   return (
//     <div className="addUser">
//         <form onSubmit={handleSearch}>
//             <input type="text" placeholder="Username" name="username"/>
//             <button>Search</button>
//         </form>
//         {user && <div className="user">
//             <div className="detail">
//                 <span>{user.username}</span>
//             </div>
//             <button onClick={handleAdd}>Add User</button>
//         </div>}
//     </div>
//   )
// }

// export default AddUser