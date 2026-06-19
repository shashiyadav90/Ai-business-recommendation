import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const API = "http://localhost:5000/api/members";

export default function MembersPage() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API);
      setMembers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "position",
      headerName: "Position",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "membershipType",
      headerName: "Membership",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "businessCategory",
      headerName: "Category",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "industry",
      headerName: "Industry",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "partnerName",
      headerName: "Partner Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "partnerCompany",
      headerName: "Partner Company",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "partnerServiceType",
      headerName: "Service Type",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "createdAt",
      headerName: "Joined",
      flex: 1,
      minWidth: 140,
      valueGetter: (value) =>
        value ? new Date(value).toLocaleDateString() : "",
    },
  ];

  return (
    <div style={styles.page}>

      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>Members List</h2>
          <p style={styles.pageSubtitle}>Manage and view all registered members</p>
        </div>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Total Members: {members.length}
        </div>
      </div>

      {/* Table Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTitle}>All Members</span>
        </div>

        <DataGrid
          rows={members}
          columns={columns}
          getRowId={(row) => row._id}
          autoHeight
          pageSizeOptions={[5, 10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          sx={{
            border: "none",
            backgroundColor: "#ffffff",
            fontFamily: "inherit",

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3effe",
              borderBottom: "1.5px solid #e0d9f7",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "#7c3aed",
              fontWeight: "600",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            },

            "& .MuiDataGrid-cell": {
              color: "#1a1a2e",
              fontSize: "14px",
              borderBottom: "0.5px solid #f0ecfd",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#faf8ff",
            },

            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#f3effe",
              borderTop: "1.5px solid #e0d9f7",
              color: "#7c3aed",
            },

            "& .MuiTablePagination-root": {
              color: "#7c3aed",
            },

            "& .MuiTablePagination-selectIcon": {
              color: "#a855f7",
            },

            "& .MuiIconButton-root": {
              color: "#a855f7",
            },

            "& .MuiDataGrid-sortIcon": {
              opacity: "1 !important",
              color: "#a855f7 !important",
            },

            "& .MuiDataGrid-iconButtonContainer": {
              visibility: "visible !important",
            },

            "& .MuiDataGrid-menuIcon": {
              visibility: "visible !important",
            },

            "& .MuiDataGrid-iconSeparator": {
              display: "none !important",
            },

            "& .MuiDataGrid-selectedRowCount": {
              color: "#7c3aed",
            },
          }}
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f4fb 0%, #ede8fc 50%, #fce8f3 100%)",
    padding: "36px 30px",
  },
  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: "#1a1a2e",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#a0a0b0",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    border: "1.5px solid #e0d9f7",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    color: "#7c3aed",
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
    display: "inline-block",
  },
  card: {
    background: "#ffffff",
    borderRadius: 20,
    border: "0.5px solid #e0d9f7",
    overflow: "hidden",
  },
  cardHeader: {
    background: "linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)",
    padding: "16px 24px",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
  },
};