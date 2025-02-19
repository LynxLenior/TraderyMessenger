import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Admin from "../admin/Admin"; // Import your Admin component
import Chat from "../chat/Chat"; // Import your Chat component

const Login = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Track admin status

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const loggedInUser = result.user;

            // Check if the user is an admin
            if (loggedInUser.email === "bagus.anselliam@ue.edu.ph") {
                setIsAdmin(true);  // Mark as admin
            } else {
                setIsAdmin(false);
            }

            // Store user details in Firestore if they don't exist
            const userRef = doc(db, "users", loggedInUser.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    id: loggedInUser.uid,
                    email: loggedInUser.email,
                    username: loggedInUser.displayName || "New User",
                    createdAt: new Date(),
                    blocked: []
                });
                await setDoc(doc(db, "userchats", loggedInUser.uid), {
                    chats: [],
                });
            }

            setUser(loggedInUser); // Set user state
        } catch (error) {
            console.log("Error logging in:", error);
        }
    };

    // If user is logged in and is an admin, show the Admin panel
    if (user && isAdmin) {
        return <Admin />;
    }

    // If user is logged in but not an admin, show the Chat interface
    if (user) {
        return <Chat />;
    }

    return (
        <div className="login">
            <div className="center">
                <button className="button" onClick={handleGoogle}>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;
