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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) 

  const { currentUser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.target)
    const username = formData.get("username")

    try {
      const userRef = collection(db, "users")
      const q = query(userRef, where("username", "==", username))
      const querySnapShot = await getDocs(q)

      if (!querySnapShot.empty) {
        const foundUser = querySnapShot.docs[0].data()

        if (foundUser.id === currentUser.id) {
          setError("You cannot add yourself!")
          setUser(null) 
          return
        }

        setUser(foundUser)
        setAdded(false) 
      } else {
        setError("User not found!")
        setUser(null)
      }
    } catch (err) {
      console.log(err)
      setError("An error occurred while searching.")
    }
  }

  const handleAdd = async () => {
    if (!user || added || loading) return;
  
    setLoading(true);
    setError(null);
  
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");
    const currentUserChatsRef = doc(userChatsRef, currentUser.id);
    const targetUserChatsRef = doc(userChatsRef, user.id);
  
    try {
        // Fetch user chat documents for both users
        const [currentUserChatsSnap, targetUserChatsSnap] = await Promise.all([
            getDoc(currentUserChatsRef),
            getDoc(targetUserChatsRef),
        ]);

        // Ensure the userchats document exists for both users
        if (!currentUserChatsSnap.exists()) {
            await setDoc(currentUserChatsRef, { chats: [] });
        }
        if (!targetUserChatsSnap.exists()) {
            await setDoc(targetUserChatsRef, { chats: [] });
        }

        // Get current chats for both users
        const currentUserChats = currentUserChatsSnap.exists() ? currentUserChatsSnap.data().chats || [] : [];
        const targetUserChats = targetUserChatsSnap.exists() ? targetUserChatsSnap.data().chats || [] : [];

        // Check if the chat already exists for either user
        const alreadyAddedByCurrentUser = currentUserChats.some(chat => chat.receiverId === user.id);
        const alreadyAddedByTargetUser = targetUserChats.some(chat => chat.receiverId === currentUser.id);

        if (alreadyAddedByCurrentUser || alreadyAddedByTargetUser) {
            setError("User already added!");
            setLoading(false);
            return;
        }

        // Create new chat document
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
            createdAt: serverTimestamp(),
            messages: [],
        });

        const chatData = {
            chatId: newChatRef.id,
            lastMessage: "",
            receiverId: user.id,
            updatedAt: Date.now(),
        };

        // Add chat reference for both users
        await updateDoc(currentUserChatsRef, {
            chats: arrayUnion(chatData),
        });

        await updateDoc(targetUserChatsRef, {
            chats: arrayUnion({
                ...chatData,
                receiverId: currentUser.id, // Swap receiverId for the target user
            }),
        });

        console.log("Chat created:", newChatRef.id);
        setAdded(true);
        setTimeout(() => setUser(null), 1000); // Hide the user container after 1 second
    } catch (err) {
        console.error(err);
        setError("An error occurred while adding the user.");
    } finally {
        setLoading(false);
    }
};

  

  return (
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
          {!added && !error && (
            <button onClick={handleAdd} disabled={loading}> 
              {loading ? "Adding..." : "Add User"}
            </button>
          )}
          {added && <span>User Added ✅</span>}
        </div>
      )}
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  )
}
export default AddUser