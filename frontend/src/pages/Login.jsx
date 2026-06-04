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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      alert("Please enter mobile number");
      return;
    }
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
    if (!otp.trim()) {
      alert("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await verifyOTP(phone, otp);
      localStorage.setItem("token", res.data.token);
      if (onLogin) onLogin();
    } catch (err) {
      alert(err?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      {/* Ambient glow blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Grid overlay */}
      <div style={styles.grid} />

      <div style={{ ...styles.wrapper, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.22,1,0.36,1)" }}>

        {/* Top accent line */}
        <div style={styles.accentLine} />

        {/* Card */}
        <div style={styles.card}>

          {/* Logo area */}
          <div style={styles.logoArea}>
            <div style={styles.iconBadge}>
              <Building2 size={22} color="#f59e0b" />
            </div>
            <h1 style={styles.title}>CompanyMatch AI</h1>
            <p style={styles.subtitle}>Business Recommendation Platform</p>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          {/* Form */}
          <div style={styles.form}>

            {/* Phone field */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Mobile Number</label>
              <div style={styles.inputWrap}>
                <div style={styles.prefix}>
                  <Phone size={15} color="rgba(255,255,255,0.3)" />
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
                  onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            </div>

            {/* OTP field */}
            {otpSent && (
              <div style={{ ...styles.fieldWrap, animation: "slideDown 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
                <label style={styles.label}>One-Time Password</label>
                <div style={styles.inputWrap}>
                  <ShieldCheck size={16} color="rgba(34,197,94,0.7)" style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ ...styles.input, paddingLeft: "44px", borderColor: "rgba(34,197,94,0.25)" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(34,197,94,0.25)")}
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
                onMouseOver={(e) => (e.currentTarget.style.background = "#fbbf24")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f59e0b")}
              >
                <span>{loading ? "Sending OTP..." : "Send OTP"}</span>
                {!loading && <ChevronRight size={16} />}
              </button>
            ) : (
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                style={{ ...styles.verifyBtn, opacity: loading ? 0.7 : 1 }}
                onMouseOver={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.2)")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(34,197,94,0.08)")}
              >
                <ShieldCheck size={16} />
                <span>{loading ? "Verifying..." : "Verify OTP"}</span>
              </button>
            )}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <Lock size={11} color="rgba(255,255,255,0.2)" />
            <span style={styles.footerText}>Secure OTP Authentication</span>
          </div>
        </div>

        {/* Trust badges */}
        <div style={styles.badges}>
          {[
            { icon: <TrendingUp size={16} color="#f59e0b" />, label: "AI Matching" },
            { icon: <Building2 size={16} color="#f59e0b" />, label: "10k+ Companies" },
            { icon: <Lock size={16} color="#f59e0b" />, label: "Bank-grade Security" },
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
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:disabled { cursor: not-allowed; }
      `}</style>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
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
    top: "-120px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "absolute",
    bottom: "-150px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 65%)",
    pointerEvents: "none",
  },
  grid: {
    position: "absolute",
    inset: 0,
    backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  wrapper: {
    width: "100%",
    maxWidth: "420px",
    position: "relative",
    zIndex: 1,
  },
  accentLine: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)",
    marginBottom: "0",
    borderRadius: "1px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderTop: "none",
    borderRadius: "0 0 20px 20px",
    padding: "2rem",
    backdropFilter: "blur(16px)",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  iconBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "52px",
    height: "52px",
    background: "rgba(245,158,11,0.1)",
    border: "0.5px solid rgba(245,158,11,0.3)",
    borderRadius: "14px",
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
    color: "rgba(255,255,255,0.3)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  divider: {
    height: "0.5px",
    background: "rgba(255,255,255,0.07)",
    marginBottom: "1.5rem",
  },
  form: {
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
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  inputWrap: {
    position: "relative",
  },
  prefix: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    pointerEvents: "none",
    zIndex: 1,
  },
  prefixText: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
  },
  prefixDivider: {
    width: "0.5px",
    height: "14px",
    background: "rgba(255,255,255,0.1)",
    marginLeft: "4px",
  },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 14px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  timerRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "4px",
  },
  timerText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
  },
  resendBtn: {
    fontSize: "11px",
    color: "#f59e0b",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  primaryBtn: {
    width: "100%",
    background: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    color: "#000",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s, transform 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "0.25rem",
  },
  verifyBtn: {
    width: "100%",
    background: "rgba(34,197,94,0.08)",
    border: "0.5px solid rgba(34,197,94,0.3)",
    borderRadius: "10px",
    padding: "13px",
    color: "#22c55e",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "0.25rem",
  },
  footer: {
    marginTop: "1.75rem",
    paddingTop: "1.25rem",
    borderTop: "0.5px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  },
  footerText: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
    letterSpacing: "0.03em",
  },
  badges: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
    marginTop: "12px",
  },
  badge: {
    background: "rgba(255,255,255,0.03)",
    border: "0.5px solid rgba(255,255,255,0.07)",
    borderRadius: "10px",
    padding: "10px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  badgeText: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
    lineHeight: 1.3,
  },
};

export default Login;