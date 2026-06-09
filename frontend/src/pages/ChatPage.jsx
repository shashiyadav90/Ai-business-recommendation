import { useState, useRef, useEffect } from "react";
import {
    Building2,
    LogOut,
    Send,
    Mail,
    Phone,
    Briefcase,
    Sparkles,
    User,
} from "lucide-react";
import { sendMessage } from "../services/api";

function ChatPage() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory, loading]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = message.trim();

        setMessage("");

        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        try {
            setLoading(true);

            const res = await sendMessage(userMsg);

            console.log(
                "API Response:",
                res.data
            );

            // Add user message first
            setChatHistory((prev) => [
                ...prev,
                {
                    role: "user",
                    text: userMsg,
                },
            ]);

            // AI asking follow-up question
            if (
                res.data.type ===
                "question"
            ) {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        text:
                            res.data.question,
                    },
                ]);

                return;
            }

            // AI found matching companies
            if (
                res.data.type ===
                "results"
            ) {
                setChatHistory((prev) => [
                    ...prev,
                    {
                        role: "ai",
                        companies:
                            res.data.companies || [],
                    },
                ]);

                return;
            }

        } catch (error) {

            console.error(error);

            setChatHistory((prev) => [
                ...prev,
                {
                    role: "user",
                    text: userMsg,
                },
                {
                    role: "ai",
                    error:
                        "Failed to get recommendations.",
                },
            ]);

        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleTextareaChange = (e) => {
        setMessage(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div style={styles.root}>
            {/* Ambient blobs */}
            <div style={styles.blob1} />
            <div style={styles.blob2} />
            <div style={styles.grid} />

            {/* Navbar */}
            <div style={styles.navbar}>
                <div style={styles.navInner}>
                    <div style={styles.navBrand}>
                        <div style={styles.navIconBadge}>
                            <Building2 size={18} color="#f59e0b" />
                        </div>
                        <div>
                            <h1 style={styles.navTitle}>CompanyMatch AI</h1>
                            <p style={styles.navSub}>AI-Powered Business Recommendations</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={styles.logoutBtn}
                        onMouseOver={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
                    >
                        <LogOut size={15} color="#ef4444" />
                        <span style={{ color: "#ef4444", fontSize: "13px", fontWeight: 500 }}>Logout</span>
                    </button>
                </div>
            </div>

            {/* Chat area */}
            <div style={styles.chatArea}>
                {chatHistory.length === 0 && !loading && (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <Sparkles size={28} color="#f59e0b" />
                        </div>
                        <h2 style={styles.emptyTitle}>How can I help you today?</h2>
                        <p style={styles.emptySub}>
                            Describe your business requirement and I'll match you with the best companies.
                        </p>
                        <div style={styles.suggestionRow}>
                            {[

                                "Looking for a real estate company in Bangalore",
                                "Need a construction contractor for a commercial project",
                                "Find me a food and beverage supplier",
                                "Looking for a healthcare consulting company",
                                "Need an IT services company for software development",
                                "Find a logistics partner for transportation services",
                                "Looking for a manufacturing company",
                                "Need a retail business solutions provider",
                                "Find a FinTech company for payment solutions",
                                "Looking for an education and training provider",

                            ].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setMessage(s)}
                                    style={styles.suggestion}
                                    onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)")}
                                    onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {chatHistory.map((msg, idx) => (
                    <div key={idx}>
                        {msg.role === "user" && (
                            <div style={styles.userBubbleWrap}>
                                <div style={styles.userBubble}>
                                    <p style={styles.userText}>{msg.text}</p>
                                </div>
                                <div style={styles.userAvatar}>
                                    <User size={15} color="rgba(255,255,255,0.7)" />
                                </div>
                            </div>
                        )}

                        {msg.role === "ai" && (
                            <div style={styles.aiBubbleWrap}>
                                <div style={styles.aiAvatar}>
                                    <Sparkles size={14} color="#f59e0b" />
                                </div>
                                <div style={styles.aiContent}>
                                    {msg.error ? (
                                        <p style={styles.errorText}>
                                            {msg.error}
                                        </p>
                                    ) : msg.text ? (
                                        <p style={styles.aiText}>
                                            {msg.text}
                                        </p>
                                    ) : msg.companies?.length === 0 ? (
                                        <p style={styles.aiText}>
                                            No matching companies found.
                                        </p>
                                    ) : (
                                        <>
                                            <p style={styles.aiIntro}>
                                                Here are <strong style={{ color: "#f59e0b" }}>{msg.companies.length} companies</strong> matched to your requirement:
                                            </p>
                                            <div style={styles.cardsGrid}>
                                                {msg.companies.map((company, i) => (
                                                    <CompanyCard key={i} company={company} index={i} />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading && (
                    <div style={styles.aiBubbleWrap}>
                        <div style={styles.aiAvatar}>
                            <Sparkles size={14} color="#f59e0b" />
                        </div>
                        <div style={styles.typingDots}>
                            <span style={{ ...styles.dot, animationDelay: "0ms" }} />
                            <span style={{ ...styles.dot, animationDelay: "160ms" }} />
                            <span style={{ ...styles.dot, animationDelay: "320ms" }} />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={styles.inputBarWrap}>
                <div style={styles.inputBar}>
                    <div style={styles.inputAccentLine} />
                    <div style={styles.inputInner}>
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            placeholder="Describe your business requirement…"
                            value={message}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            style={styles.textarea}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !message.trim()}
                            style={{
                                ...styles.sendBtn,
                                background: message.trim() && !loading ? "#f59e0b" : "rgba(255,255,255,0.06)",
                                cursor: message.trim() && !loading ? "pointer" : "not-allowed",
                            }}
                            onMouseOver={(e) => {
                                if (message.trim() && !loading) e.currentTarget.style.background = "#fbbf24";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = message.trim() && !loading ? "#f59e0b" : "rgba(255,255,255,0.06)";
                            }}
                        >
                            <Send size={16} color={message.trim() && !loading ? "#000" : "rgba(255,255,255,0.25)"} />
                        </button>
                    </div>
                    <p style={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
                </div>
            </div>

            <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        textarea::placeholder {color: rgba(0,0,0,0.45);}
        textarea:focus { outline: none; }
        textarea { resize: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>
        </div>
    );
}

function CompanyCard({ company, index }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            style={{
                ...styles.card,
                borderColor: hovered ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.08)",
                transform: hovered ? "translateY(-2px)" : "translateY(0)",
                animation: `fadeUp 0.4s ease ${index * 80}ms both`,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                    <Building2 size={18} color="#f59e0b" />
                </div>
                <h3 style={styles.cardName}>{company.name}</h3>
            </div>

            <p style={styles.cardDesc}>{company.description}</p>

            {company.services?.length > 0 && (
                <div style={styles.servicesWrap}>
                    <div style={styles.servicesLabel}>
                        <Briefcase size={12} color="#22c55e" />
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Services</span>
                    </div>
                    <div style={styles.tags}>
                        {company.services.map((s, i) => (
                            <span key={i} style={styles.tag}>{s}</span>
                        ))}
                    </div>
                </div>
            )}

            <div style={styles.cardFooter}>
                {company.email && (
                    <div style={styles.contactRow}>
                        <Mail size={13} color="#60a5fa" />
                        <span style={styles.contactText}>{company.email}</span>
                    </div>
                )}
                {company.phone && (
                    <div style={styles.contactRow}>
                        <Phone size={13} color="#22c55e" />
                        <span style={styles.contactText}>{company.phone}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    root: {
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    blob1: {
        position: "fixed",
        top: "-100px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "600px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
    },
    blob2: {
        position: "fixed",
        bottom: "0",
        right: "-100px",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 65%)",
        pointerEvents: "none",
        zIndex: 0,
    },
    grid: {
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
        zIndex: 0,
    },
    navbar: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
    },
    navInner: {
        maxWidth: "860px",
        margin: "0 auto",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    navBrand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    navIconBadge: {
        width: "36px",
        height: "36px",
        background: "rgba(245,158,11,0.1)",
        border: "0.5px solid rgba(245,158,11,0.25)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    navTitle: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#ffffff",
        margin: 0,
        letterSpacing: "-0.02em",
    },
    navSub: {
        fontSize: "11px",
        color: "rgba(255,255,255,0.3)",
        margin: 0,
        letterSpacing: "0.02em",
    },
    logoutBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        background: "rgba(239,68,68,0.08)",
        border: "0.5px solid rgba(239,68,68,0.2)",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    chatArea: {
        flex: 1,
        maxWidth: "860px",
        width: "100%",
        margin: "0 auto",
        padding: "2rem 1.5rem 8rem",
        position: "relative",
        zIndex: 1,
        overflowY: "auto",
        boxSizing: "border-box",
    },
    emptyState: {
        textAlign: "center",
        padding: "4rem 1rem 2rem",
    },
    emptyIcon: {
        width: "64px",
        height: "64px",
        background: "rgba(245,158,11,0.1)",
        border: "0.5px solid rgba(245,158,11,0.25)",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.25rem",
    },
    emptyTitle: {
        fontSize: "22px",
        fontWeight: "500",
        color: "#ffffff",
        margin: "0 0 8px",
    },
    emptySub: {
        fontSize: "14px",
        color: "rgba(255,255,255,0.35)",
        margin: "0 0 2rem",
        lineHeight: 1.6,
    },
    suggestionRow: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        justifyContent: "center",
    },
    suggestion: {
        padding: "8px 16px",
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        color: "rgba(255,255,255,0.55)",
        fontSize: "13px",
        cursor: "pointer",
        transition: "border-color 0.2s",
    },
    userBubbleWrap: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        gap: "10px",
        marginBottom: "1.5rem",
    },
    userBubble: {
        background:
            "linear-gradient(135deg,#f59e0b,#fbbf24)",
        border: "none",
        borderRadius: "18px 18px 4px 18px",
        padding: "12px 16px",
        maxWidth: "72%",
    },
    userText: {
        margin: 0,
        fontSize: "14px",
        color: "#000",
        lineHeight: 1.6,
    },
    userAvatar: {
        width: "32px",
        height: "32px",
        minWidth: "32px",
        background: "rgba(255,255,255,0.08)",
        border: "0.5px solid rgba(255,255,255,0.12)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    aiBubbleWrap: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "1.75rem",
    },
    aiAvatar: {
        width: "32px",
        height: "32px",
        minWidth: "32px",
        background: "rgba(245,158,11,0.1)",
        border: "0.5px solid rgba(245,158,11,0.25)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "2px",
    },
    aiContent: {
        flex: 1,
        minWidth: 0,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.05)",
        padding: "14px",
        borderRadius: "16px",
    },
    aiIntro: {
        fontSize: "14px",
        color: "rgba(255,255,255,0.7)",
        margin: "0 0 1rem",
        lineHeight: 1.6,
    },
    aiText: {
        fontSize: "14px",
        color: "rgba(255,255,255,0.6)",
        margin: 0,
        lineHeight: 1.6,
    },
    errorText: {
        fontSize: "14px",
        color: "rgba(239,68,68,0.8)",
        margin: 0,
    },
    typingDots: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        padding: "14px 16px",
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "18px 18px 18px 4px",
    },
    dot: {
        display: "inline-block",
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: "rgba(245,158,11,0.7)",
        animation: "bounce 1.2s infinite",
    },
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "12px",
    },
    card: {
        background: "rgba(255,255,255,0.04)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "1.125rem",
        transition: "border-color 0.2s, transform 0.2s",
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
    },
    cardIcon: {
        width: "36px",
        height: "36px",
        minWidth: "36px",
        background: "rgba(245,158,11,0.1)",
        border: "0.5px solid rgba(245,158,11,0.2)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    cardName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#ffffff",
        margin: 0,
        lineHeight: 1.3,
    },
    cardDesc: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.6,
        margin: "0 0 12px",
    },
    servicesWrap: {
        marginBottom: "12px",
    },
    servicesLabel: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        marginBottom: "6px",
    },
    tags: {
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
    },
    tag: {
        padding: "3px 10px",
        background: "rgba(255,255,255,0.06)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: "20px",
        fontSize: "11px",
        color: "rgba(255,255,255,0.5)",
    },
    cardFooter: {
        borderTop: "0.5px solid rgba(255,255,255,0.07)",
        paddingTop: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    contactRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    contactText: {
        fontSize: "12px",
        color: "rgba(255,255,255,0.45)",
    },
    inputBarWrap: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "1rem 1.5rem 1.5rem",
        background: "linear-gradient(to top, #0a0a0a 60%, transparent)",
        zIndex: 10,
    },
    inputBar: {
        maxWidth: "860px",
        margin: "0 auto",
        background: "rgba(25,25,25,0.95)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "22px",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        boxShadow:
            "0 8px 40px rgba(0,0,0,0.35)",
    },
    inputAccentLine: {
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)",
    },
    inputInner: {
        display: "flex",
        alignItems: "flex-end",
        gap: "10px",
        padding: "14px",
        background: "rgba(255,255,255,0.03)",
    },
    textarea: {
        flex: 1,
        background: "#ffffff",
        border: "none",
        outline: "none",
        color: "#000000",
        fontSize: "15px",
        lineHeight: 1.6,
        maxHeight: "160px",
        overflowY: "auto",
        fontFamily: "inherit",
        resize: "none",
        padding: "12px 14px",
        borderRadius: "12px",
        boxSizing: "border-box",
        caretColor: "#ffffff",
    },
    sendBtn: {
        width: "42px",
        height: "42px",
        minWidth: "42px",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
        marginBottom: "2px",
    },
    inputHint: {
        fontSize: "10px",
        color: "rgba(255,255,255,0.15)",
        textAlign: "center",
        margin: "0 0 8px",
        letterSpacing: "0.02em",
    },
};

export default ChatPage;