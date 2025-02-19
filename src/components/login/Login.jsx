import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Admin from "../admin/Admin"; // Import Admin component

const Login = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    const handleGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    id: user.uid,
                    email: user.email,
                    username: user.displayName || "New User",
                    createdAt: new Date(),
                    blocked: [],
                });
                await setDoc(doc(db, "userchats", user.uid), { chats: [] });
            }

            if (user.email === "bagus.anselliam@ue.edu.ph") {
                setIsAdmin(true);
            } else {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };

    return (
        <div className="login">
            {!isAdmin ? (
                <div className="center">
                    <button className="button" onClick={handleGoogle}>
                        Continue As...
                    </button>
                </div>
            ) : (
                <Admin /> // Render Admin.jsx for the admin
            )}
        </div>
    );
};

export default Login;
