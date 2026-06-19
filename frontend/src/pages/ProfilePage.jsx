import { useEffect, useState } from "react";
import axios from "axios";
import { User, Phone, Mail, Info, Edit2, Save } from "lucide-react";

const API = "http://localhost:5000/api/auth/profile";

export default function ProfilePage() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(API, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data.user);
        } catch (err) {
            console.log(err);
        }
    };

    const updateProfile = async () => {
        try {
            await axios.put(API, profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsEditing(false); // move this BEFORE alert so it always runs
            alert("Profile Updated");
        } catch (err) {
            console.log(err);
            setIsEditing(false); // also close form even if API fails
        }
    };

    const getInitials = (name = "") =>
        name
            .split(" ")
            .filter(Boolean)
            .map((w) => w[0].toUpperCase())
            .slice(0, 2)
            .join("") || "?";

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                {/* Gradient Header */}
                <div style={styles.header}>
                    <div style={styles.avatarRing}>
                        {profile.name ? (
                            <span style={styles.initials}>{getInitials(profile.name)}</span>
                        ) : (
                            <User size={34} color="#fff" />
                        )}
                    </div>
                    <h2 style={styles.headerName}>{profile.name || "Your Name"}</h2>
                    <p style={styles.headerEmail}>{profile.email || "your@email.com"}</p>
                </div>

                {isEditing ? (
                    /* ── Edit Form ── */
                    <div style={styles.formBody}>
                        <div style={styles.inputWrap}>
                            <label style={styles.label}>Full name</label>
                            <input
                                style={styles.input}
                                value={profile.name || ""}
                                placeholder="Name"
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputWrap}>
                            <label style={styles.label}>Phone</label>
                            <input
                                style={styles.input}
                                type="tel"
                                value={profile.phone || ""}
                                placeholder="Phone"
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputWrap}>
                            <label style={styles.label}>Email</label>
                            <input
                                style={styles.input}
                                value={profile.email || ""}
                                placeholder="Email"
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            />
                        </div>

                        <div style={styles.inputWrap}>
                            <label style={styles.label}>About</label>
                            <textarea
                                style={styles.textarea}
                                value={profile.about || ""}
                                placeholder="About"
                                onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                            />
                        </div>

                        <button style={styles.saveBtn} onClick={updateProfile}>
                            <Save size={18} style={{ marginRight: 8 }} />
                            Save Profile
                        </button>
                    </div>
                ) : (
                    /* ── View Card ── */
                    <>
                        <div style={styles.cardBody}>
                            <FieldRow icon={<User size={18} color="#7c3aed" />} label="Full name" value={profile.name} />
                            <FieldRow icon={<Phone size={18} color="#7c3aed" />} label="Phone" value={profile.phone} />
                            <FieldRow icon={<Mail size={18} color="#7c3aed" />} label="Email" value={profile.email} />
                            <FieldRow icon={<Info size={18} color="#7c3aed" />} label="About" value={profile.about} last />
                        </div>

                        <div style={styles.editBtnWrap}>
                            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
                                <Edit2 size={18} style={{ marginRight: 8 }} />
                                Edit Profile
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function FieldRow({ icon, label, value, last }) {
    return (
        <div style={{ ...styles.fieldRow, ...(last ? { borderBottom: "none" } : {}) }}>
            <div style={styles.fieldIcon}>{icon}</div>
            <div>
                <div style={styles.fieldLabel}>{label}</div>
                <div style={styles.fieldValue}>{value || "—"}</div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f4fb 0%, #ede8fc 50%, #fce8f3 100%)",
        padding: "40px 20px",
    },
    card: {
        maxWidth: "620px",
        margin: "auto",
        background: "#fff",
        borderRadius: "20px",
        border: "0.5px solid #e0d9f7",
        overflow: "hidden",
    },
    header: {
        background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
        padding: "36px 32px 28px",
        textAlign: "center",
    },
    avatarRing: {
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.2)",
        border: "3px solid rgba(255,255,255,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
    },
    initials: {
        fontSize: 28,
        fontWeight: 500,
        color: "#fff",
    },
    headerName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: 500,
        marginBottom: 4,
    },
    headerEmail: {
        color: "rgba(255,255,255,0.78)",
        fontSize: 13,
    },

    /* View mode */
    cardBody: {
        padding: "4px 32px",
    },
    fieldRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 0",
        borderBottom: "0.5px solid #f0ecfd",
    },
    fieldIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: "#f3effe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
    },
    fieldLabel: {
        fontSize: 11,
        color: "#a0a0b0",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 3,
    },
    fieldValue: {
        fontSize: 15,
        color: "#1a1a2e",
    },
    editBtnWrap: {
        padding: "20px 32px 28px",
    },
    editBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "13px",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
    },

    /* Edit form */
    formBody: {
        padding: "24px 32px 28px",
    },
    inputWrap: {
        marginBottom: 18,
    },
    label: {
        display: "block",
        fontSize: 11,
        color: "#a0a0b0",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: 6,
    },
    input: {
        width: "100%",
        padding: "11px 14px",
        border: "1.5px solid #e5e0f8",
        borderRadius: 10,
        fontSize: 15,
        color: "#1a1a2e",
        background: "#faf9fe",
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        minHeight: 90,
        padding: "11px 14px",
        border: "1.5px solid #e5e0f8",
        borderRadius: 10,
        fontSize: 15,
        color: "#1a1a2e",
        background: "#faf9fe",
        resize: "vertical",
        boxSizing: "border-box",
    },
    saveBtn: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "13px",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        marginTop: 8,
    },
};