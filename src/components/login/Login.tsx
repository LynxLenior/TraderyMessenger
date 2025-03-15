import { useNavigate, useParams } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./login.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import React from "react";
import { findUserDataById } from "../../lib/appwrite";
import { 
    arrayUnion, 
    collection, 
    getDocs, 
    query, 
    serverTimestamp, 
    updateDoc, 
    where 
} from "firebase/firestore";
import { useUserStore } from "../../lib/userStore";

export interface TraderyProfiles {
    userId: string;
    displayName?: string | null;
    defaultName: string;
    profileImageId: string;
    profileSummary?: string | null;
    profileImageWidth: number;
    profileImageHeight: number;
    userEmail: string;
}

const Login = () => {
    const { currentUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<TraderyProfiles | null>(null);
    const { id } = useParams();

    // Search for the user in Firebase
    const handleSearch = async (user: TraderyProfiles) => {
        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", user.defaultName));
        const querySnapShot = await getDocs(q);
        
        if (!querySnapShot.empty) {
            const foundUser = querySnapShot.docs[0].data();
            return foundUser.id === currentUser.id;
        }
        return false; // If no user exists
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { userdb } = await findUserDataById(id);
                setUser(userdb);
                if (userdb) {
                    const userExists = await handleSearch(userdb);

                    setLoading(true);
                    if (!userExists) {
                        try {
                            // Create account
                            const res = await createUserWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                            await setDoc(doc(db, "users", res.user.uid), {
                                username: userdb.defaultName,
                                email: userdb.userEmail,
                                id: res.user.uid,
                                blocked: [],
                            });
                            await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });
                            toast.success("Account Created! You can login now!");
                        } catch (err) {
                            console.log(err);
                            toast.error(err.message);
                        }
                    } else {
                        // Sign in user
                        try {
                            await signInWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                            toast.success("Account Login!");
                        } catch (err) {
                            console.log(err);
                            toast.error(err.message);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, currentUser]);

    return (
        <div className="login">
            {/* Loading and UI components */}
            {loading ? <div>Loading...</div> : <div>Welcome to Tradery Messenger!</div>}
        </div>
    );
};

export default Login;