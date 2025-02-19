import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
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
            }
        };

        const fetchReports = async () => {
            try {
                const reportsCollection = collection(db, "reports");
                const reportsSnapshot = await getDocs(reportsCollection);
                const reportsList = reportsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReports(reportsList);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        const fetchData = async () => {
            await fetchUsers();
            await fetchReports();
            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome, Admin! Here you can manage users and view reports.</p>

            {/* Buttons */}
            <div className="admin-buttons">
                <button className="back-button" onClick={() => navigate("/")}>
                    Back to Chat
                </button>
                <button className="logout" onClick={() => auth.signOut()}>
                    Logout
                </button>
            </div>

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {/* User List */}
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

                    {/* Reports List */}
                    <div className="reports-list">
                        <h2>Reported Users</h2>
                        {reports.length === 0 ? (
                            <p>No reports available.</p>
                        ) : (
                            <ul>
                                {reports.map(report => (
                                    <li key={report.id} className="report-item">
                                        <strong>Reporter ID:</strong> {report.reporterId} <br />
                                        <strong>Reported User ID:</strong> {report.reportedUserId} <br />
                                        <strong>Reason:</strong> {report.reason} <br />
                                        <strong>Timestamp:</strong> {new Date(report.timestamp.seconds * 1000).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;
