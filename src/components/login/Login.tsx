import { useNavigate, useParams } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, getDocs, query, where, collection } from "firebase/firestore";
import "./login.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import React from "react";
import { findUserDataById } from "../../lib/appwrite";
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

    const handleSearch = async (user: TraderyProfiles) => {
        if (!user?.defaultName) return false; // Prevent undefined queries

        const userRef = collection(db, "users");
        const q = query(userRef, where("username", "==", user.defaultName));
        const querySnapShot = await getDocs(q);
        
        return !querySnapShot.empty; // Returns true if user exists, false otherwise
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return; // Prevent running if id is undefined

            try {
                setLoading(true);
                const { userdb } = await findUserDataById(id);

                if (!userdb || !userdb.userEmail || !userdb.userId) {
                    toast.error("Invalid user data from Appwrite.");
                    return;
                }

                setUser(userdb);
                const userExists = await handleSearch(userdb);

                if (!userExists) {
                    // Create new Firebase account
                    try {
                        const res = await createUserWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                        await setDoc(doc(db, "users", res.user.uid), {
                            username: userdb.defaultName,
                            email: userdb.userEmail,
                            id: res.user.uid,
                            blocked: [],
                        });
                        await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });
                        toast.success("Account Created! You can login now!");
                    } catch (err: any) {
                        console.error("Account Creation Error:", err);
                        toast.error(err.message);
                    }
                } else {
                    // Log in existing user
                    try {
                        await signInWithEmailAndPassword(auth, userdb.userEmail, userdb.userId);
                        toast.success("Account Logged In!");
                    } catch (err: any) {
                        console.error("Login Error:", err);
                        toast.error(err.message);
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
    }, [id]);

    return (
        <div className="login">
            {loading ? <div>Loading...</div> : <div>Welcome to Tradery Messenger!</div>}
        </div>
    );
};

export default Login;