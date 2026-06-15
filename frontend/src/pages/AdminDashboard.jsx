import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Users,
  ShieldCheck,
  LayoutGrid,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const [members, setMembers] = useState([]);

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessCategory: "",
    services: "",
    location: "",
    description: "",
  });

  const [editingMember, setEditingMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // ---------- Load Members ----------
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await axios.get(`${API_BASE}/members`);
      setMembers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  // ---------- Add / Update Member ----------
  const resetMemberForm = () => {
    setMemberForm({
      name: "",
      email: "",
      phone: "",
      businessCategory: "",
      services: "",
      location: "",
      description: "",
    });
    setEditingMember(null);
  };

  const openAddMemberModal = () => {
    resetMemberForm();
    setShowMemberModal(true);
  };

  const openEditMemberModal = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      businessCategory: member.businessCategory || "",
      services: Array.isArray(member.services)
        ? member.services.join(",")
        : member.services || "",
      location: member.location || "",
      description: member.description || "",
    });
    setShowMemberModal(true);
  };

  const addMember = async () => {
    try {
      await axios.post(`${API_BASE}/members`, {
        ...memberForm,
        services: memberForm.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      await fetchMembers();
      setShowMemberModal(false);
      resetMemberForm();
    } catch (err) {
      console.error("Failed to add member", err);
      alert("Failed to add member");
    }
  };

  const updateMember = async () => {
    try {
      await axios.put(`${API_BASE}/members/${editingMember._id}`, {
        ...memberForm,
        services: memberForm.services
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      await fetchMembers();
      setShowMemberModal(false);
      resetMemberForm();
    } catch (err) {
      console.error("Failed to update member", err);
      alert("Failed to update member");
    }
  };

  const handleMemberSubmit = () => {
    if (editingMember) {
      updateMember();
    } else {
      addMember();
    }
  };

  // ---------- Delete Member ----------
  const deleteMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${API_BASE}/members/${id}`);
      await fetchMembers();
    } catch (err) {
      console.error("Failed to delete member", err);
      alert("Failed to delete member");
    }
  };

  // ---------- Dashboard Stats ----------
  const totalMembers = members.length;
  const totalCategories = new Set(
    members.map((m) => m.businessCategory).filter(Boolean)
  ).size;

  // ---------- DataGrid Columns ----------
  const memberColumns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    { field: "businessCategory", headerName: "Category", flex: 1, minWidth: 140 },
    {
      field: "services",
      headerName: "Services",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <div style={styles.cellTags}>
          {(Array.isArray(params.value) ? params.value : []).slice(0, 3).map((s, i) => (
            <span key={i} style={styles.cellTag}>{s}</span>
          ))}
        </div>
      ),
    },
    { field: "location", headerName: "Location", flex: 1, minWidth: 130 },
    {
      field: "edit",
      headerName: "Edit",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          style={styles.iconActionBtn}
          onClick={() => openEditMemberModal(params.row)}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)")}
        >
          <Pencil size={14} color="#f59e0b" />
        </button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          style={styles.iconActionBtnDanger}
          onClick={() => deleteMember(params.row._id)}
          onMouseOver={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)")}
          onMouseOut={(e) => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)")}
        >
          <Trash2 size={14} color="#ef4444" />
        </button>
      ),
    },
  ];

  return (
    <div style={styles.root}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />
      <div style={styles.grid} />

      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.navIconBadge}>
              <ShieldCheck size={18} color="#f59e0b" />
            </div>
            <div>
              <h1 style={styles.navTitle}>Admin Dashboard</h1>
              <p style={styles.navSub}>CompanyMatch AI · Management Console</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.accentLine} />

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <StatCard
            icon={<Users size={20} color="#f59e0b" />}
            label="Total Members"
            value={totalMembers}
          />
          <StatCard
            icon={<LayoutGrid size={20} color="#60a5fa" />}
            label="Categories"
            value={totalCategories}
          />
        </div>

        {/* Members Section */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Members</h2>
              <p style={styles.sectionSub}>Manage business member listings</p>
            </div>
            <button
              style={styles.primaryBtn}
              onClick={openAddMemberModal}
              onMouseOver={(e) => (e.currentTarget.style.background = "#fbbf24")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#f59e0b")}
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div style={styles.gridWrap}>
            <DataGrid
              key={members.length}
              rows={members}
              columns={memberColumns}
              getRowId={(row) => row._id}
              loading={loadingMembers}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={dataGridSx}
            />
            {!loadingMembers && members.length === 0 && (
              <div style={styles.emptyRow}>
                No members added yet. Click "Add Member" to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {showMemberModal && (
        <div style={styles.modalOverlay} onClick={() => setShowMemberModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingMember ? "Edit Member" : "Add Member"}
              </h3>
              <button style={styles.closeBtn} onClick={() => setShowMemberModal(false)}>
                <X size={18} color="rgba(255,255,255,0.5)" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <FormField
                label="Name"
                value={memberForm.name}
                onChange={(v) => setMemberForm({ ...memberForm, name: v })}
                placeholder="Company name"
              />
              <FormField
                label="Email"
                value={memberForm.email}
                onChange={(v) => setMemberForm({ ...memberForm, email: v })}
                placeholder="contact@company.com"
              />
              <FormField
                label="Phone"
                value={memberForm.phone}
                onChange={(v) => setMemberForm({ ...memberForm, phone: v })}
                placeholder="+91 9876543210"
              />
              <FormField
                label="Business Category"
                value={memberForm.businessCategory}
                onChange={(v) => setMemberForm({ ...memberForm, businessCategory: v })}
                placeholder="e.g. IT Services"
              />
              <FormField
                label="Services (comma separated)"
                value={memberForm.services}
                onChange={(v) => setMemberForm({ ...memberForm, services: v })}
                placeholder="Web Development, Cloud, AI"
              />
              <FormField
                label="Location"
                value={memberForm.location}
                onChange={(v) => setMemberForm({ ...memberForm, location: v })}
                placeholder="Bangalore, India"
              />
              <FormField
                label="Description"
                value={memberForm.description}
                onChange={(v) => setMemberForm({ ...memberForm, description: v })}
                placeholder="Brief description of the business"
                textarea
              />
            </div>

            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowMemberModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.primaryBtn}
                onClick={handleMemberSubmit}
                onMouseOver={(e) => (e.currentTarget.style.background = "#fbbf24")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#f59e0b")}
              >
                <Save size={16} />
                {editingMember ? "Update Member" : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input:focus, textarea:focus { outline: none; border-color: rgba(245,158,11,0.5) !important; }
      `}</style>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statIcon}>{icon}</div>
      <div>
        <p style={styles.statValue}>{value}</p>
        <p style={styles.statLabel}>{label}</p>
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, textarea }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.label}>{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={styles.textareaInput}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      )}
    </div>
  );
}

const dataGridSx = {
  border: "none",
  backgroundColor: "#0f0f0f",

  "& .MuiDataGrid-root": {
    backgroundColor: "#0f0f0f !important",
  },

  "& .MuiDataGrid-main": {
    backgroundColor: "#0f0f0f !important",
  },

  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: "#0f0f0f !important",
  },

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#141414 !important",
    color: "#ffffff !important",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "#141414 !important",
    color: "#ffffff !important",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#ffffff !important",
    fontWeight: 600,
  },

  "& .MuiDataGrid-topContainer": {
    backgroundColor: "#141414 !important",
  },

  "& .MuiDataGrid-container--top": {
    backgroundColor: "#141414 !important",
  },

  "& .MuiDataGrid-row": {
    backgroundColor: "#0f0f0f !important",
    color: "#ffffff",
  },

  "& .MuiDataGrid-cell": {
    backgroundColor: "#0f0f0f !important",
    color: "#ffffff",
    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(245,158,11,0.08) !important",
  },

  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#141414 !important",
    color: "#ffffff",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  "& .MuiTablePagination-root": {
    color: "#ffffff",
  },

  "& .MuiSvgIcon-root": {
    color: "#ffffff",
  },

  "& .MuiDataGrid-overlay": {
    backgroundColor: "#0f0f0f",
  },

  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },

  "& .MuiDataGrid-columnHeader:focus": {
    outline: "none",
  },
};

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
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
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
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
    maxWidth: "1200px",
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
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem 4rem",
    position: "relative",
    zIndex: 1,
  },
  accentLine: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)",
    marginBottom: "1.5rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "2rem",
  },
  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "1.25rem",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    backdropFilter: "blur(16px)",
  },
  statIcon: {
    width: "44px",
    height: "44px",
    minWidth: "44px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 2px",
    letterSpacing: "-0.02em",
  },
  statLabel: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  sectionCard: {
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    backdropFilter: "blur(16px)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "1.25rem",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0 0 4px",
    letterSpacing: "-0.02em",
  },
  sectionSub: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.35)",
    margin: 0,
  },
  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    color: "#000",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  gridWrap: {
  background: "#0f0f0f",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  overflow: "hidden",
  },
  emptyRow: {
    padding: "1.5rem",
    textAlign: "center",
    fontSize: "13px",
    color: "rgba(255,255,255,0.3)",
  },
  cellTags: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cellTag: {
    padding: "2px 8px",
    background: "rgba(255,255,255,0.06)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    fontSize: "10px",
    color: "rgba(255,255,255,0.5)",
  },
  iconActionBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(245,158,11,0.08)",
    border: "0.5px solid rgba(245,158,11,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  iconActionBtnDanger: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "rgba(239,68,68,0.08)",
    border: "0.5px solid rgba(239,68,68,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: "1.5rem",
  },
  modal: {
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    background: "#0f0f0f",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "1.5rem",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ffffff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  closeBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "1.5rem",
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
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "11px 14px",
    color: "#ffffff",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  textareaInput: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "11px 14px",
    color: "#ffffff",
    fontSize: "14px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    resize: "none",
    fontFamily: "inherit",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  cancelBtn: {
    padding: "10px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "0.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
};

export default AdminDashboard;