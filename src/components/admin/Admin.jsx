import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
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
                const reportsSnapshot = await getDocs(collection(db, "reports"));
                const reportsList = reportsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setReports(reportsList);
                setFilteredReports(reportsList); // Initially show all reports
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

    // Delete a report
    const handleDeleteReport = async (reportId) => {
        try {
            await deleteDoc(doc(db, "reports", reportId));
            setReports(reports.filter(report => report.id !== reportId));
            setFilteredReports(filteredReports.filter(report => report.id !== reportId));
        } catch (error) {
            console.error("Error deleting report:", error);
        }
    };

    // Filter reports by a specific user
    const handleViewReports = async (userId) => {
        const userReports = reports.filter(report => report.reportedUserId === userId);
        setFilteredReports(userReports);
    };

    // Reset filter to show all reports
    const handleShowAllReports = () => {
        setFilteredReports(reports);
    };

    return (
        <div className="admin-container">
            <h1>Admin Panel</h1>
            <p>Welcome, Admin! Here you can manage users and view reports.</p>

            {/* Buttons */}
            <div className="admin-buttons">
                <button className="back-button" onClick={() => navigate("/TraderyMessenger")}>Back to Chat</button>
                <button className="logout" onClick={() => auth.signOut()}>Logout</button>
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
                                <li key={user.id} className="user-item">
                                    <strong>{user.username}</strong> - {user.email}
                                    <button onClick={() => handleViewReports(user.id)}>View Reports</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Reports List */}
                    <div className="reports-list">
                        <h2>Reported Users</h2>
                        {filteredReports.length === 0 ? (
                            <p>No reports available.</p>
                        ) : (
                            <>
                                <button onClick={handleShowAllReports}>Show All Reports</button>
                                <ul>
                                    {filteredReports.map(report => (
                                        <li key={report.id} className="report-item">
                                            <strong>Reporters Username:</strong> {report.reporterUsername} <br />
                                            <strong>Reporter ID:</strong> {report.reporterId} <br />
                                            <strong>Reporteds Username:</strong> {report.reportedUsername} <br />
                                            <strong>Reported User ID:</strong> {report.reportedUserId} <br />
                                            <strong>Reason:</strong> {report.reason} <br />
                                            <strong>Timestamp:</strong> {new Date(report.timestamp.seconds * 1000).toLocaleString()} <br />
                                            <button onClick={() => handleDeleteReport(report.id)}>Delete</button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Admin;
