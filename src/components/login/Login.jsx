import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Admin from "../admin/Admin"; // Import Admin component

const Login = () => {
    const [user, setUser] = useState(null); // Store logged-in user

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            setUser(user); // Store user in state

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    id: user.uid,
                    email: user.email,
                    username: user.displayName || "New User",
                    createdAt: new Date(),
                    blocked: []
                });
                await setDoc(doc(db, "userchats", user.uid), { chats: [] });
            }
        } catch (error) {
            console.log("Error logging in:", error);
        }
    };

    return (
        <div className="login">
            <div className="center">
                {!user ? (
                    <button className="button" onClick={handleGoogle}>
                        Continue As...
                    </button>
                ) : (
                    <div>
                        <p>Welcome, {user.email}</p>
                        {user.email === "bagus.anselliam@ue.edu.ph" && <Admin />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
