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
  ChevronDown,
  ChevronRight,
  UserPlus,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api/admin";

function AdminDashboard() {
  const [chapterAdmins, setChapterAdmins] = useState([]);
  const [regionalAdmins, setRegionalAdmins] = useState({});
  const [expandedChapter, setExpandedChapter] = useState(null);

  const [chapterForm, setChapterForm] = useState({
    name: "", email: "", phone: "", businessCategory: "", services: "", location: "", description: "",
  });

  const [regionalForm, setRegionalForm] = useState({
    name: "", email: "", phone: "", businessCategory: "", services: "", location: "", description: "",
  });

  const [editingChapter, setEditingChapter] = useState(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showRegionalModal, setShowRegionalModal] = useState(false);
  const [editingRegional, setEditingRegional] = useState(null);
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [loadingRegional, setLoadingRegional] = useState({});

  useEffect(() => { fetchChapterAdmins(); }, []);

  const fetchChapterAdmins = async () => {
    try {
      setLoadingChapter(true);
      const res = await axios.get(`${API_BASE}/members`);
      setChapterAdmins(res.data || []);
    } catch (err) {
      console.error("Failed to fetch chapter admins", err);
    } finally {
      setLoadingChapter(false);
    }
  };

  const resetChapterForm = () => {
    setChapterForm({ name: "", email: "", phone: "", businessCategory: "", services: "", location: "", description: "" });
    setEditingChapter(null);
  };

  const openAddChapterModal = () => { resetChapterForm(); setShowChapterModal(true); };

  const openEditChapterModal = (row) => {
    setEditingChapter(row);
    setChapterForm({
      name: row.name || "", email: row.email || "", phone: row.phone || "",
      businessCategory: row.businessCategory || "",
      services: Array.isArray(row.services) ? row.services.join(",") : row.services || "",
      location: row.location || "", description: row.description || "",
    });
    setShowChapterModal(true);
  };

  const handleChapterSubmit = async () => {
    const payload = { ...chapterForm, services: chapterForm.services.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      if (editingChapter) {
        await axios.put(`${API_BASE}/members/${editingChapter._id}`, payload);
      } else {
        await axios.post(`${API_BASE}/members`, payload);
      }
      await fetchChapterAdmins();
      setShowChapterModal(false);
      resetChapterForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save chapter admin");
    }
  };

  const deleteChapterAdmin = async (id) => {
    if (!window.confirm("Delete this chapter admin?")) return;
    try {
      await axios.delete(`${API_BASE}/members/${id}`);
      setRegionalAdmins((prev) => { const n = { ...prev }; delete n[id]; return n; });
      await fetchChapterAdmins();
    } catch (err) { alert("Failed to delete"); }
  };

  const fetchRegionalAdmins = async (chapterId) => {
    try {
      setLoadingRegional((prev) => ({ ...prev, [chapterId]: true }));
      const res = await axios.get(`${API_BASE}/members/${chapterId}/regional`);
      setRegionalAdmins((prev) => ({ ...prev, [chapterId]: res.data || [] }));
    } catch (err) {
      console.error("Failed to fetch regional admins", err);
      setRegionalAdmins((prev) => ({ ...prev, [chapterId]: [] }));
    } finally {
      setLoadingRegional((prev) => ({ ...prev, [chapterId]: false }));
    }
  };

  const toggleExpand = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      if (!regionalAdmins[chapterId]) fetchRegionalAdmins(chapterId);
    }
  };

  const resetRegionalForm = () => {
    setRegionalForm({ name: "", email: "", phone: "", businessCategory: "", services: "", location: "", description: "" });
    setEditingRegional(null);
  };

  const openAddRegionalModal = (chapterId) => { setActiveChapterId(chapterId); resetRegionalForm(); setShowRegionalModal(true); };

  const openEditRegionalModal = (chapterId, row) => {
    setActiveChapterId(chapterId);
    setEditingRegional(row);
    setRegionalForm({
      name: row.name || "", email: row.email || "", phone: row.phone || "",
      businessCategory: row.businessCategory || "",
      services: Array.isArray(row.services) ? row.services.join(",") : row.services || "",
      location: row.location || "", description: row.description || "",
    });
    setShowRegionalModal(true);
  };

  const handleRegionalSubmit = async () => {
    const payload = { ...regionalForm, services: regionalForm.services.split(",").map((s) => s.trim()).filter(Boolean) };
    try {
      if (editingRegional) {
        await axios.put(`${API_BASE}/members/${activeChapterId}/regional/${editingRegional._id}`, payload);
      } else {
        await axios.post(`${API_BASE}/members/${activeChapterId}/regional`, payload);
      }
      await fetchRegionalAdmins(activeChapterId);
      setShowRegionalModal(false);
      resetRegionalForm();
    } catch (err) {
      console.error(err);
      alert("Failed to save regional admin");
    }
  };

  const deleteRegionalAdmin = async (chapterId, regionalId) => {
    if (!window.confirm("Delete this regional admin?")) return;
    try {
      await axios.delete(`${API_BASE}/members/${chapterId}/regional/${regionalId}`);
      await fetchRegionalAdmins(chapterId);
    } catch (err) { alert("Failed to delete regional admin"); }
  };

  const totalChapterAdmins = chapterAdmins.length;
  const totalRegionalAdmins = Object.values(regionalAdmins).reduce((sum, arr) => sum + arr.length, 0);
  const totalCategories = new Set(chapterAdmins.map((m) => m.businessCategory).filter(Boolean)).size;

  const chapterColumns = [
    {
      field: "expand", headerName: "", width: 48, sortable: false, filterable: false,
      renderCell: (params) => (
        <button style={styles.expandBtn} onClick={() => toggleExpand(params.row._id)}>
          {expandedChapter === params.row._id
            ? <ChevronDown size={15} color="#7c3aed" />
            : <ChevronRight size={15} color="#c4b5fd" />}
        </button>
      ),
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    { field: "businessCategory", headerName: "Category", flex: 1, minWidth: 140 },
    {
      field: "services", headerName: "Services", flex: 1.2, minWidth: 180,
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
      field: "addRegional", headerName: "Add Regional", width: 120, sortable: false, filterable: false,
      renderCell: (params) => (
        <button
          style={styles.addRegionalBtn}
          onClick={() => { toggleExpand(params.row._id); openAddRegionalModal(params.row._id); }}
        >
          <UserPlus size={13} color="#7c3aed" />
          <span style={{ fontSize: "11px", color: "#7c3aed" }}>Regional</span>
        </button>
      ),
    },
    {
      field: "edit", headerName: "Edit", width: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <button style={styles.iconActionBtn} onClick={() => openEditChapterModal(params.row)}>
          <Pencil size={13} color="#7c3aed" />
        </button>
      ),
    },
    {
      field: "delete", headerName: "Delete", width: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <button style={styles.iconActionBtnDanger} onClick={() => deleteChapterAdmin(params.row._id)}>
          <Trash2 size={13} color="#ef4444" />
        </button>
      ),
    },
  ];

  const regionalColumns = (chapterId) => [
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 130 },
    { field: "businessCategory", headerName: "Category", flex: 1, minWidth: 140 },
    {
      field: "services", headerName: "Services", flex: 1.2, minWidth: 180,
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
      field: "edit", headerName: "Edit", width: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <button style={styles.iconActionBtn} onClick={() => openEditRegionalModal(chapterId, params.row)}>
          <Pencil size={13} color="#7c3aed" />
        </button>
      ),
    },
    {
      field: "delete", headerName: "Delete", width: 80, sortable: false, filterable: false,
      renderCell: (params) => (
        <button style={styles.iconActionBtnDanger} onClick={() => deleteRegionalAdmin(chapterId, params.row._id)}>
          <Trash2 size={13} color="#ef4444" />
        </button>
      ),
    },
  ];

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.navBrand}>
            <div style={styles.navIconBadge}>
              <ShieldCheck size={18} color="#7c3aed" />
            </div>
            <div>
              <h1 style={styles.navTitle}>Admin Dashboard</h1>
              <p style={styles.navSub}>Management Console</p>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.container}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          <StatCard icon={<Users size={20} color="#7c3aed" />} label="Chapter Admins" value={totalChapterAdmins} color="#f3effe" iconColor="#7c3aed" />
          <StatCard icon={<UserPlus size={20} color="#a855f7" />} label="Regional Admins" value={totalRegionalAdmins} color="#faf5ff" iconColor="#a855f7" />
          <StatCard icon={<LayoutGrid size={20} color="#ec4899" />} label="Categories" value={totalCategories} color="#fdf2f8" iconColor="#ec4899" />
        </div>

        {/* Chapter Admins Section */}
        <div style={styles.sectionCard}>
          <div style={styles.cardGradientHeader}>
            <div>
              <h2 style={styles.cardHeaderTitle}>Chapter Wise Admins</h2>
              <p style={styles.cardHeaderSub}>Click the arrow to expand and manage regional admins</p>
            </div>
            <button style={styles.primaryBtn} onClick={openAddChapterModal}>
              <Plus size={16} />
              Add Chapter Admin
            </button>
          </div>

          <div style={styles.gridWrap}>
            <DataGrid
              key={chapterAdmins.length}
              rows={chapterAdmins}
              columns={chapterColumns}
              getRowId={(row) => row._id}
              loading={loadingChapter}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              sx={dataGridSx}
            />
            {!loadingChapter && chapterAdmins.length === 0 && (
              <div style={styles.emptyRow}>No chapter admins yet. Click "Add Chapter Admin" to create one.</div>
            )}
          </div>

          {/* Expandable Regional Admin panels */}
          {chapterAdmins.map((chapter) =>
            expandedChapter === chapter._id ? (
              <div key={chapter._id} style={styles.regionalPanel}>
                <div style={styles.regionalPanelHeader}>
                  <div style={styles.regionalPanelTitle}>
                    <div style={styles.regionalDot} />
                    <span style={styles.regionalPanelName}>
                      Regional Admins under <strong style={{ color: "#7c3aed" }}>{chapter.name}</strong>
                    </span>
                  </div>
                  <button style={styles.addRegionalBtnLarge} onClick={() => openAddRegionalModal(chapter._id)}>
                    <UserPlus size={15} />
                    Add Regional Admin
                  </button>
                </div>

                <div style={styles.regionalGridWrap}>
                  <DataGrid
                    key={(regionalAdmins[chapter._id] || []).length}
                    rows={regionalAdmins[chapter._id] || []}
                    columns={regionalColumns(chapter._id)}
                    getRowId={(row) => row._id}
                    loading={loadingRegional[chapter._id]}
                    autoHeight
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10]}
                    initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
                    sx={regionalDataGridSx}
                  />
                  {!loadingRegional[chapter._id] && (regionalAdmins[chapter._id] || []).length === 0 && (
                    <div style={styles.emptyRow}>No regional admins yet for this chapter.</div>
                  )}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Chapter Admin Modal */}
      {showChapterModal && (
        <MemberModal
          title={editingChapter ? "Edit Chapter Admin" : "Add Chapter Admin"}
          form={chapterForm}
          setForm={setChapterForm}
          onSubmit={handleChapterSubmit}
          onClose={() => { setShowChapterModal(false); resetChapterForm(); }}
          submitLabel={editingChapter ? "Update" : "Save"}
        />
      )}

      {/* Regional Admin Modal */}
      {showRegionalModal && (
        <MemberModal
          title={editingRegional ? "Edit Regional Admin" : "Add Regional Admin"}
          form={regionalForm}
          setForm={setRegionalForm}
          onSubmit={handleRegionalSubmit}
          onClose={() => { setShowRegionalModal(false); resetRegionalForm(); }}
          submitLabel={editingRegional ? "Update" : "Save"}
          accent="#a855f7"
        />
      )}

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e0d9f7; border-radius: 4px; }
        input::placeholder, textarea::placeholder { color: #c4b5fd; }
        input:focus, textarea:focus { outline: none; border-color: #a855f7 !important; }
      `}</style>
    </div>
  );
}

// ---------- Reusable Modal ----------
function MemberModal({ title, form, setForm, onSubmit, onClose, submitLabel, accent = "#7c3aed" }) {
  const fields = [
    { key: "name", label: "Name", placeholder: "Full name" },
    { key: "email", label: "Email", placeholder: "email@example.com" },
    { key: "phone", label: "Phone", placeholder: "+91 9876543210" },
    { key: "businessCategory", label: "Business Category", placeholder: "e.g. IT Services" },
    { key: "services", label: "Services (comma separated)", placeholder: "Web Dev, Cloud, AI" },
    { key: "location", label: "Location", placeholder: "Bangalore, India" },
    { key: "description", label: "Description", placeholder: "Brief description", textarea: true },
  ];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ ...styles.modalGradientHeader, background: `linear-gradient(135deg, ${accent}, #ec4899)` }}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <button style={styles.closeBtn} onClick={onClose}>
            <X size={18} color="#fff" />
          </button>
        </div>
        <div style={styles.modalBody}>
          {fields.map((f) => (
            <FormField
              key={f.key}
              label={f.label}
              value={form[f.key]}
              onChange={(v) => setForm({ ...form, [f.key]: v })}
              placeholder={f.placeholder}
              textarea={f.textarea}
            />
          ))}
        </div>
        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={{ ...styles.primaryBtn, background: `linear-gradient(135deg, ${accent}, #ec4899)` }} onClick={onSubmit}>
            <Save size={15} />
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, iconColor }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statIcon, background: color, border: `1.5px solid ${iconColor}22` }}>{icon}</div>
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
        <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={styles.textareaInput} />
      ) : (
        <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={styles.input} />
      )}
    </div>
  );
}

// ---------- DataGrid SX ----------
const dataGridSx = {
  border: "none",
  backgroundColor: "#ffffff",
  "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f3effe !important", borderBottom: "1.5px solid #e0d9f7" },
  "& .MuiDataGrid-columnHeader": { backgroundColor: "#f3effe !important" },
  "& .MuiDataGrid-columnHeaderTitle": { color: "#7c3aed !important", fontWeight: 600, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.04em" },
  "& .MuiDataGrid-row": { backgroundColor: "#ffffff !important", color: "#1a1a2e" },
  "& .MuiDataGrid-cell": { backgroundColor: "#ffffff !important", color: "#1a1a2e", borderBottom: "0.5px solid #f0ecfd" },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#faf8ff !important" },
  "& .MuiDataGrid-footerContainer": { backgroundColor: "#f3effe !important", borderTop: "1.5px solid #e0d9f7" },
  "& .MuiTablePagination-root": { color: "#7c3aed" },
  "& .MuiDataGrid-overlay": { backgroundColor: "#ffffff" },
  "& .MuiDataGrid-cell:focus": { outline: "none !important" },
  "& .MuiDataGrid-columnHeader:focus": { outline: "none !important" },
  "& .MuiDataGrid-cell:focus-within": { outline: "none !important" },
  "& .MuiDataGrid-columnHeader:focus-within": { outline: "none !important" },
  "& .MuiDataGrid-sortIcon": { opacity: "1 !important", visibility: "visible !important", color: "#a855f7 !important" },
  "& .MuiDataGrid-iconButtonContainer": { visibility: "visible !important", opacity: "1 !important", width: "auto !important" },
  "& .MuiIconButton-root": { background: "transparent !important", color: "#7c3aed !important", padding: "2px !important" },
  "& .MuiIconButton-root:hover": { background: "transparent !important" },
  "& .MuiDataGrid-menuIcon": { visibility: "visible !important", opacity: "1 !important", width: "auto !important" },
  "& .MuiDataGrid-menuIconButton": { visibility: "visible !important", opacity: "1 !important", color: "#7c3aed !important" },
  "& .MuiDataGrid-iconSeparator": { display: "none !important" },
  "& .MuiTablePagination-selectIcon": { color: "#a855f7" },
  "& .MuiDataGrid-selectedRowCount": { color: "#7c3aed" },
};

const regionalDataGridSx = {
  ...dataGridSx,
  backgroundColor: "#faf8ff",
  "& .MuiDataGrid-columnHeaders": { backgroundColor: "#ede8fc !important", borderBottom: "1.5px solid #d8b4fe" },
  "& .MuiDataGrid-columnHeader": { backgroundColor: "#ede8fc !important" },
  "& .MuiDataGrid-columnHeaderTitle": { color: "#7c3aed !important", fontWeight: 600 },
  "& .MuiDataGrid-row": { backgroundColor: "#faf8ff !important", color: "#1a1a2e" },
  "& .MuiDataGrid-cell": { backgroundColor: "#faf8ff !important", color: "#1a1a2e", borderBottom: "0.5px solid #ede8fc" },
  "& .MuiDataGrid-row:hover": { backgroundColor: "#f3effe !important" },
  "& .MuiDataGrid-footerContainer": { backgroundColor: "#ede8fc !important" },
  "& .MuiDataGrid-overlay": { backgroundColor: "#faf8ff" },
};

const styles = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f4fb 0%, #ede8fc 50%, #fce8f3 100%)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  navbar: {
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)",
    borderBottom: "0.5px solid #e0d9f7",
  },
  navInner: {
    maxWidth: "1200px", margin: "0 auto", padding: "14px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  navBrand: { display: "flex", alignItems: "center", gap: "12px" },
  navIconBadge: {
    width: "36px", height: "36px",
    background: "#f3effe", border: "1.5px solid #e0d9f7",
    borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  navTitle: { fontSize: "16px", fontWeight: "600", color: "#1a1a2e", margin: 0, letterSpacing: "-0.02em" },
  navSub: { fontSize: "11px", color: "#a0a0b0", margin: 0 },
  container: { maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem 4rem" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px", marginBottom: "2rem",
  },
  statCard: {
    background: "#ffffff", border: "0.5px solid #e0d9f7",
    borderRadius: "16px", padding: "1.25rem",
    display: "flex", alignItems: "center", gap: "14px",
  },
  statIcon: {
    width: "44px", height: "44px", minWidth: "44px",
    borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: "24px", fontWeight: "700", color: "#1a1a2e", margin: "0 0 2px", letterSpacing: "-0.02em" },
  statLabel: { fontSize: "12px", color: "#a0a0b0", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" },
  sectionCard: {
    background: "#ffffff", border: "0.5px solid #e0d9f7",
    borderRadius: "20px", overflow: "hidden", marginBottom: "1.5rem",
  },
  cardGradientHeader: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
    padding: "20px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: "12px",
  },
  cardHeaderTitle: { fontSize: "18px", fontWeight: "600", color: "#ffffff", margin: "0 0 4px", letterSpacing: "-0.02em" },
  cardHeaderSub: { fontSize: "13px", color: "rgba(255,255,255,0.75)", margin: 0 },
  primaryBtn: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.5)",
    borderRadius: "10px", padding: "10px 18px",
    color: "#ffffff", fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
  gridWrap: { overflow: "hidden" },
  emptyRow: { padding: "1.5rem", textAlign: "center", fontSize: "13px", color: "#a0a0b0" },
  expandBtn: {
    width: "28px", height: "28px", borderRadius: "8px",
    background: "#f3effe", border: "1px solid #e0d9f7",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  addRegionalBtn: {
    display: "flex", alignItems: "center", gap: "5px",
    padding: "5px 10px", background: "#f3effe",
    border: "1px solid #e0d9f7", borderRadius: "8px", cursor: "pointer",
  },
  addRegionalBtnLarge: {
    display: "flex", alignItems: "center", gap: "7px",
    padding: "8px 16px", background: "#f3effe",
    border: "1.5px solid #d8b4fe", borderRadius: "10px",
    color: "#7c3aed", fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
  regionalPanel: {
    margin: "12px 16px 16px",
    background: "#faf8ff", border: "1px solid #e0d9f7", borderRadius: "14px", padding: "1.25rem",
  },
  regionalPanelHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    flexWrap: "wrap", gap: "10px", marginBottom: "1rem",
  },
  regionalPanelTitle: { display: "flex", alignItems: "center", gap: "10px" },
  regionalDot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
  },
  regionalPanelName: { fontSize: "14px", color: "#4a4a6a" },
  regionalGridWrap: {
    background: "#ffffff", borderRadius: "10px",
    border: "1px solid #e0d9f7", overflow: "hidden",
  },
  cellTags: { display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" },
  cellTag: {
    padding: "2px 8px", background: "#f3effe",
    border: "0.5px solid #e0d9f7", borderRadius: "20px",
    fontSize: "10px", color: "#7c3aed",
  },
  iconActionBtn: {
    width: "30px", height: "30px", borderRadius: "8px",
    background: "#f3effe", border: "1px solid #e0d9f7",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  iconActionBtnDanger: {
    width: "30px", height: "30px", borderRadius: "8px",
    background: "#fff0f0", border: "1px solid #fecaca",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(124,58,237,0.15)",
    backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 100, padding: "1.5rem",
  },
  modal: {
    width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto",
    background: "#ffffff", border: "0.5px solid #e0d9f7",
    borderRadius: "20px", overflow: "hidden",
  },
  modalGradientHeader: {
    padding: "20px 24px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  modalTitle: { fontSize: "18px", fontWeight: "600", color: "#ffffff", margin: 0, letterSpacing: "-0.02em" },
  closeBtn: {
    width: "32px", height: "32px", borderRadius: "8px",
    background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  modalBody: { display: "flex", flexDirection: "column", gap: "1rem", padding: "24px 24px 0" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "10px", padding: "20px 24px 24px" },
  fieldWrap: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "11px", color: "#a0a0b0", textTransform: "uppercase", letterSpacing: "0.05em" },
  input: {
    width: "100%", background: "#faf9fe", border: "1.5px solid #e5e0f8",
    borderRadius: "10px", padding: "11px 14px", color: "#1a1a2e", fontSize: "14px",
    boxSizing: "border-box", fontFamily: "inherit",
  },
  textareaInput: {
    width: "100%", background: "#faf9fe", border: "1.5px solid #e5e0f8",
    borderRadius: "10px", padding: "11px 14px", color: "#1a1a2e", fontSize: "14px",
    boxSizing: "border-box", resize: "none", fontFamily: "inherit",
  },
  cancelBtn: {
    padding: "10px 18px", background: "#f3effe",
    border: "1.5px solid #e0d9f7", borderRadius: "10px",
    color: "#7c3aed", fontSize: "13px", fontWeight: "500", cursor: "pointer",
  },
};

export default AdminDashboard;