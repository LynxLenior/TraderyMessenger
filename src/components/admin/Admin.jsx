import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../lib/firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./admin.css";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null); // For modal
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
                setFilteredReports(reportsList);
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

    // Show modal with full report
    const handleShowFullReport = (report) => {
        setSelectedReport(report);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedReport(null);
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
                                    <button onClick={() => setFilteredReports(reports.filter(report => report.reportedUserId === user.id))}>
                                        View Reports
                                    </button>
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
                            <ul>
                                {filteredReports.map(report => (
                                    <li key={report.id} className="report-item">
                                        <strong>Reporter:</strong> {report.reporterUsername} <br />
                                        <strong>Reported User:</strong> {report.reportedUsername} <br />
                                        <strong>Reason:</strong> 
                                        {report.reason.length > 50 ? (
                                            <>
                                                {report.reason.substring(0, 50)}...{" "}
                                                <button className="read-more" onClick={() => handleShowFullReport(report)}>
                                                    Read More
                                                </button>
                                            </>
                                        ) : (
                                            report.reason
                                        )}
                                        <br />
                                        <strong>Timestamp:</strong> {new Date(report.timestamp.seconds * 1000).toLocaleString()} <br />
                                        <button onClick={() => handleDeleteReport(report.id)}>Delete</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Modal for full report */}
                    {selectedReport && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Full Report</h2>
                                <p><strong>Reporter:</strong> {selectedReport.reporterUsername}</p>
                                <p><strong>Reporter ID:</strong> {selectedReport.reporterId}</p>
                                <p><strong>Reported ID:</strong> {selectedReport.reportedUserId}</p>
                                <p><strong>Reported User:</strong> {selectedReport.reportedUsername}</p>
                                <p><strong>Reason:</strong> {selectedReport.reason}</p>
                                <p><strong>Timestamp:</strong> {new Date(selectedReport.timestamp.seconds * 1000).toLocaleString()}</p>
                                <button className="close-modal" onClick={handleCloseModal}>Close</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Admin;
