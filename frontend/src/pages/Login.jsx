import { useState, useEffect } from "react";
import { Phone, ShieldCheck, Building2, TrendingUp, Lock, ChevronRight } from "lucide-react";
import { sendOTP, verifyOTP } from "../services/authApi";

function Login({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone.trim()) { alert("Please enter mobile number"); return; }
    try {
      setLoading(true);
      await sendOTP(phone);
      alert("OTP Sent Successfully");
      setOtpSent(true);
      setTimer(30);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) { alert("Please enter OTP"); return; }
    try {
      setLoading(true);
      const res = await verifyOTP(phone, otp);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("phone", phone);
      if (onLogin) onLogin();
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.blob3} />

      <div style={{
        ...styles.wrapper,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* Card */}
        <div style={styles.card}>

          {/* Gradient Header */}
          <div style={styles.cardHeader}>
            <div style={styles.iconBadge}>
              <Building2 size={24} color="#fff" />
            </div>
            <h1 style={styles.title}>CompanyMatch AI</h1>
            <p style={styles.subtitle}>Business Recommendation Platform</p>
          </div>

          {/* Form Body */}
          <div style={styles.formBody}>

            {/* Phone field */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Mobile Number</label>
              <div style={styles.inputWrap}>
                <div style={styles.prefix}>
                  <Phone size={15} color="#a855f7" />
                  <span style={styles.prefixText}>+91</span>
                  <div style={styles.prefixDivider} />
                </div>
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={otpSent}
                  style={{ ...styles.input, paddingLeft: "80px", opacity: otpSent ? 0.6 : 1 }}
                  onFocus={(e) => (e.target.style.borderColor = "#a855f7")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e0f8")}
                />
              </div>
            </div>

            {/* OTP field */}
            {otpSent && (
              <div style={{ ...styles.fieldWrap, animation: "slideDown 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
                <label style={styles.label}>One-Time Password</label>
                <div style={styles.inputWrap}>
                  <ShieldCheck
                    size={16}
                    color="#7c3aed"
                    style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "44px", borderColor: "#d8b4fe" }}
                    onFocus={(e) => (e.target.style.borderColor = "#7c3aed")}
                    onBlur={(e) => (e.target.style.borderColor = "#d8b4fe")}
                  />
                </div>
                <div style={styles.timerRow}>
                  {timer > 0 ? (
                    <span style={styles.timerText}>Resend OTP in {timer}s</span>
                  ) : (
                    <button onClick={handleSendOTP} style={styles.resendBtn}>Resend OTP</button>
                  )}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            {!otpSent ? (
              <button
                onClick={handleSendOTP}
                disabled={loading}
                style={{ ...styles.primaryBtn, opacity: loading ? 0.7 : 1 }}
              >
                <span>{loading ? "Sending OTP..." : "Send OTP"}</span>
                {!loading && <ChevronRight size={16} />}
              </button>
            ) : (
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{ ...styles.verifyBtn, opacity: loading ? 0.7 : 1 }}
              >
                <ShieldCheck size={16} />
                <span>{loading ? "Verifying..." : "Verify OTP"}</span>
              </button>
            )}

            {/* Footer */}
            <div style={styles.footer}>
              <Lock size={11} color="#c4b5fd" />
              <span style={styles.footerText}>Secure OTP Authentication</span>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div style={styles.badges}>
          {[
            { icon: <TrendingUp size={16} color="#7c3aed" />, label: "AI Matching" },
            { icon: <Building2 size={16} color="#a855f7" />, label: "10k+ Companies" },
            { icon: <Lock size={16} color="#ec4899" />, label: "Bank-grade Security" },
          ].map((b) => (
            <div key={b.label} style={styles.badge}>
              {b.icon}
              <span style={styles.badgeText}>{b.label}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #c4b5fd; }
        input:disabled { cursor: not-allowed; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f4fb 0%, #ede8fc 50%, #fce8f3 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  blob1: {
    position: "absolute",
    top: "-120px", left: "50%", transform: "translateX(-50%)",
    width: "600px", height: "500px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-150px", right: "-100px",
    width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  blob3: {
    position: "absolute",
    bottom: "-100px", left: "-80px",
    width: "350px", height: "350px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  wrapper: {
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 1,
  },
  card: {
    background: "#ffffff",
    border: "0.5px solid #e0d9f7",
    borderRadius: "20px",
    overflow: "hidden",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
    padding: "2rem 2rem 1.75rem",
    textAlign: "center",
  },
  iconBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "56px", height: "56px",
    background: "rgba(255,255,255,0.2)",
    border: "2px solid rgba(255,255,255,0.4)",
    borderRadius: "16px",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 6px",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.75)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  formBody: {
    padding: "1.75rem 2rem 2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    color: "#a0a0b0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputWrap: { position: "relative" },
  prefix: {
    position: "absolute",
    left: "14px", top: "50%", transform: "translateY(-50%)",
    display: "flex", alignItems: "center", gap: "6px",
    pointerEvents: "none", zIndex: 1,
  },
  prefixText: { fontSize: "13px", color: "#7c3aed" },
  prefixDivider: {
    width: "0.5px", height: "14px",
    background: "#e0d9f7", marginLeft: "4px",
  },
  input: {
    width: "100%",
    background: "#faf9fe",
    border: "1.5px solid #e5e0f8",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#1a1a2e",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  timerRow: { display: "flex", justifyContent: "flex-end", marginTop: "4px" },
  timerText: { fontSize: "11px", color: "#a0a0b0" },
  resendBtn: {
    fontSize: "11px", color: "#7c3aed",
    background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600,
  },
  primaryBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #7c3aed, #a855f7)",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "0.25rem",
  },
  verifyBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "0.25rem",
  },
  footer: {
    marginTop: "0.5rem",
    paddingTop: "1.25rem",
    borderTop: "0.5px solid #f0ecfd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  footerText: {
    fontSize: "11px",
    color: "#c4b5fd",
    letterSpacing: "0.03em",
  },
  badges: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginTop: "12px",
  },
  badge: {
    background: "#ffffff",
    border: "0.5px solid #e0d9f7",
    borderRadius: "10px",
    padding: "10px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  badgeText: {
    fontSize: "10px",
    color: "#a0a0b0",
    textAlign: "center",
    lineHeight: 1.3,
  },
};

export default Login;