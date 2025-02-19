import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, "users");
                const usersSnapshot = await getDocs(usersCollection);
                const usersList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome, Admin! Here you can manage users.</p>

            {/* Buttons */}
            <div className="admin-buttons">
                <button className="back-button" onClick={() => navigate("/TraderyMessenger")}>
                    Back to Chat
                </button>
                <button className="logout" onClick={() => auth.signOut()}>
                    Logout
                </button>
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div className="user-list">
                    <h2>Registered Users</h2>
                    <ul>
                        {users.map(user => (
                            <li key={user.id}>
                                <strong>{user.username}</strong> - {user.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Admin;
