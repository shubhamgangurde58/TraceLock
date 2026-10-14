
//Admin Dashboard
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admindashboard.css";

// ICONS /
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const icons = {
  dashboard: ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  upload:    ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
  employees: ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  files:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  logs:      ["M12 20h9","M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"],
  leak:      ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  logout:    ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  bell:      ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  user:      ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  menu:      ["M3 12h18","M3 6h18","M3 18h18"],
  close:     ["M18 6L6 18","M6 6l12 12"],
  alert:     ["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"],
  download:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  check:     ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  trash:     ["M3 6h18","M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6","M10 11v6","M14 11v6","M9 6V4h6v2"],
  pdf:       ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  docx:      ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M9 15h6","M9 11h6"],
  cloudUp:   ["M18 15l-6-6-6 6","M12 9v12"],
  scan:      ["M3 7V5a2 2 0 012-2h2","M17 3h2a2 2 0 012 2v2","M21 17v2a2 2 0 01-2 2h-2","M7 21H5a2 2 0 01-2-2v-2","M12 8v4l3 3"],
  unlock:    ["M8 11V7a4 4 0 018 0v1","M5 11h14v10H5z"],
  copy:      ["M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2","M8 2h8a2 2 0 012 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 012-2z"],
  reset:     ["M3 2v6h6","M3 8A9 9 0 1121 12"],
  history:   ["M12 8v4l3 3","M3.05 11A9 9 0 1021 12"],
  tag:       ["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z","M7 7h.01"],
  share:     ["M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8","M16 6l-4-4-4 4","M12 2v13"],
  activity:  ["M22 12h-4l-3 9L9 3l-3 9H2"],
  info2:     ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M11 12h1v4h1"],
  group:     ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  plus:      ["M12 5v14","M5 12h14"],
  send:      ["M22 2L11 13","M22 2L15 22 11 13 2 9l20-7z"],
  eye3:      ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  login:     ["M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4","M10 17l5-5-5-5","M15 12H3"],
  tracking:  ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 6v6l4 2"],

  tasks:     ["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"],
  calendar:  ["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"],
  clipcheck: ["M9 11l3 3L22 4","M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2.5"],

thumbUp:   ["M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z","M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"],
thumbDown: ["M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z","M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"],
};

const navItems = [
  { key: "dashboard", label: "Dashboard",        icon: "dashboard" },
  { key: "groups",    label: "Group Management", icon: "group"     },
  { key: "upload",    label: "Upload File",       icon: "upload"    },
  { key: "sharing",   label: "File Sharing",      icon: "send"      },
  { key: "tracking",  label: "File Tracking",     icon: "tracking"  },
  { key: "employees", label: "Manage Employees",  icon: "employees" },
  { key: "activity",  label: "Employee Activity", icon: "activity"  },
  { key: "logs",      label: "Download Logs",     icon: "logs"      },
  { key: "tasks",     label: "Task Management", icon: "tasks" },
  { key: "leak",      label: "Leak Detection",    icon: "leak"      },
  
];

// HELPERS //
const fmtSize = (b) =>
  b < 1024 ? b+" B" : b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(1)+" MB";
const fmtTime = (d) => {
  const diff = Math.floor((new Date()-d)/1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return Math.floor(diff/60)+" min ago";
  if (diff < 86400) return Math.floor(diff/3600)+" hr ago";
  return new Date(d).toLocaleDateString("en-IN");
};
const EmptyState = ({ icon, title, sub }) => (
  <div className="empty-state">
    <div className="empty-icon"><Icon d={icons[icon]} size={28}/></div>
    <div className="empty-title">{title}</div>
    <div className="empty-sub">{sub}</div>
  </div>
);

/* SIDEBAR */
const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
            <path d="M40 14L20 24V40C20 52 29 62 40 66C51 62 60 52 60 40V24L40 14Z"
              fill="rgba(79,138,255,0.3)" stroke="rgba(100,160,255,0.8)" strokeWidth="2"/>
            <circle cx="40" cy="38" r="7" fill="none" stroke="rgba(150,190,255,0.9)" strokeWidth="1.5"/>
            <circle cx="40" cy="38" r="2.5" fill="rgba(150,190,255,1)"/>
            <line x1="40" y1="40.5" x2="40" y2="46" stroke="rgba(150,190,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && <span className="sidebar-logo-text">TraceLock</span>}
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <Icon d={collapsed ? icons.menu : icons.close} size={16}/>
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button key={item.key}
            className={`sidebar-item ${active === item.key ? "sidebar-item-active" : ""}`}
            onClick={() => setActive(item.key)}>
            <span className="sidebar-item-icon"><Icon d={icons[item.icon]} size={18}/></span>
            {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
          </button>
        ))}
      </nav>
      <button className="sidebar-logout" onClick={() => navigate("/login")}>
        <span className="sidebar-item-icon"><Icon d={icons.logout} size={18}/></span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

/*TOPBAR */
const TopBar = ({ activePage, taskNotifCount, taskNotifs }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const pageLabel = navItems.find(n => n.key === activePage)?.label || "Dashboard";
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{pageLabel}</h1>
        <span className="topbar-date">
          {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </span>
      </div>
      <div className="topbar-right">
       <div className="notif-wrap">

  <button
    className="topbar-icon-btn"
    onClick={() => setShowNotifications(!showNotifications)}
  >
    <Icon d={icons.bell} size={18}/>

    {taskNotifCount > 0 && (
      <span className="notif-badge">
        {taskNotifCount}
      </span>
    )}
  </button>

  {showNotifications && (
    <div className="notif-dropdown">

      <div className="notif-title">
        Notifications
      </div>

      {taskNotifs.length === 0 ? (
        <div className="notif-empty">
          No notifications
        </div>
      ) : (
        taskNotifs.map((n) => (
          <div key={n.id} className="notif-item">

            <div className="notif-message">
              {n.message}
            </div>

            <div className="notif-time">
              {new Date(n.createdAt).toLocaleString()}
            </div>

          </div>
        ))
      )}

    </div>
  )}

</div>
        <div className="topbar-profile-wrap">
          <button className="topbar-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="topbar-avatar">AD</div>
            <div className="topbar-profile-info">
              <span className="topbar-name">Admin User</span>
              <span className="topbar-role">Super Admin</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-header">
                <div className="topbar-avatar" style={{width:40,height:40,fontSize:14}}>AD</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>Admin User</div>
                  <div style={{fontSize:12,color:"var(--muted)"}}>admin@securedocs.in</div>
                </div>
              </div>
              <div className="profile-dropdown-divider"/>
              <button className="profile-dropdown-item"><Icon d={icons.user} size={14}/> My Profile</button>
              <button className="profile-dropdown-item logout-item" onClick={() => navigate("/login")}>
                <Icon d={icons.logout} size={14}/> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* DASHBOARD */
const DashboardContent = ({ files, groups }) => (
  <div className="dashboard-content">
    <div className="stats-grid">
      {[
        { label:"Total Files",     value:files.length, sub:"Uploaded files",  color:"blue",   icon:"files"     },
        { label:"Total Employees", value:"—",          sub:"Connect backend", color:"teal",   icon:"employees" },
        { label:"Groups",          value:groups.length,sub:"Active groups",   color:"purple", icon:"group"     },
        { label:"Security Alerts", value:"0",          sub:"No active alerts",color:"red",    icon:"alert"     },
      ].map(s => (
        <div className={`stat-card stat-card-${s.color}`} key={s.label}>
          <div className="stat-card-top">
            <div className="stat-card-label">{s.label}</div>
            <div className={`stat-card-icon-wrap stat-icon-${s.color}`}><Icon d={icons[s.icon]} size={18}/></div>
          </div>
          <div className="stat-card-value">{s.value}</div>
          <div className="stat-card-sub">{s.sub}</div>
        </div>
      ))}
    </div>
    <div className="dashboard-grid-2">
      <div className="dashboard-card">
        <div className="card-header"><h3 className="card-title">Recent Files</h3></div>
        {files.length === 0
          ? <EmptyState icon="files" title="No files uploaded yet" sub="Upload files from Upload File section"/>
          : <div className="activity-list">
              {[...files].reverse().slice(0,5).map(f => (
                <div className="activity-item" key={f.id}>
                  <div className="activity-avatar-file">
                    <Icon d={f.type==="application/pdf"?icons.pdf:icons.docx} size={16}/>
                  </div>
                  <div className="activity-info">
                    <div className="activity-main"><span className="activity-file">{f.name}</span></div>
                    <div className="activity-name">{fmtSize(f.size)} · {fmtTime(f.uploadedAt)}</div>
                  </div>
                  <span className="activity-badge activity-badge-upload">Uploaded</span>
                </div>
              ))}
            </div>
        }
      </div>
      <div className="dashboard-card">
        <div className="card-header"><h3 className="card-title">Active Groups</h3></div>
        {groups.length === 0
          ? <EmptyState icon="group" title="No groups created" sub="Create groups from Group Management"/>
          : <div className="activity-list">
              {groups.slice(0,5).map(g => (
                <div className="activity-item" key={g.id}>
                  <div className="activity-avatar-file" style={{background:"rgba(127,119,221,0.15)",color:"#b3acff"}}>
                    <Icon d={icons.group} size={16}/>
                  </div>
                  <div className="activity-info">
                    <div className="activity-main"><span className="activity-file">{g.name}</span></div>
                    <div className="activity-name">{g.members.length} member{g.members.length!==1?"s":""}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  </div>
);

/* GROUP MANAGEMENT */
const GroupManagement = ({ groups, setGroups }) => {
  const [showCreate,   setShowCreate]   = useState(false);
  const [groupName,    setGroupName]    = useState("");
  const [groupDesc,    setGroupDesc]    = useState("");
  const [selected,     setSelected]     = useState(null);
  const [memberInput,  setMemberInput]  = useState("");
  const [employees,    setEmployees]    = useState([]);
  useEffect(() => {
fetch("http://localhost:5000/api/users/admin/employees")
    .then(res => res.json())
    .then(data => {
      console.log("EMPLOYEES:", data);
      setEmployees(data);
    })
    .catch(err => console.log(err));
}, []);
  const [error,        setError]        = useState("");

  const handleCreate = () => {
    if (!groupName.trim()) { setError("Group name is required."); return; }
    setGroups(prev => [...prev, { id:Date.now(), name:groupName.trim(), description:groupDesc.trim(), members:[], createdAt:new Date() }]);
    setGroupName(""); setGroupDesc(""); setError(""); setShowCreate(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this group?")) {
      setGroups(prev => prev.filter(g => g.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const handleAddMember = () => {
  if (!memberInput.trim() || !selected) return;

  if (selected.members.includes(memberInput.trim())) return;

  const updated = { 
    ...selected, 
    members: [...selected.members, memberInput.trim()] 
  };

  setGroups(prev => prev.map(g => g.id === updated.id ? updated : g));
  setSelected(updated);

  
  fetch("http://localhost:5000/api/users/admin/add-to-group", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: memberInput,
      groupName: selected.name
    })
  })
  .then(res => res.json())
  .then(data => console.log("Notification:", data))
  .catch(err => console.log("ERROR:", err));

  setMemberInput("");
};

  const handleRemoveMember = (emp) => {
    const updated = { ...selected, members: selected.members.filter(m => m!==emp) };
    setGroups(prev => prev.map(g => g.id===updated.id ? updated : g));
    setSelected(updated);
  };

  return (
    <div className="groups-page">
      <div className="groups-toolbar">
        <div>
          <div className="page-header-title">Group Management</div>
          <div className="page-header-sub">{groups.length} group{groups.length!==1?"s":""} · Share files with multiple employees at once</div>
        </div>
        <button className="btn-action" onClick={() => setShowCreate(true)}>
          <Icon d={icons.plus} size={15}/> Create Group
        </button>
      </div>

      {showCreate && (
        <div className="inline-form-card">
          <div className="inline-form-title">Create New Group</div>
          <div className="inline-form-row">
            <div className="form-group">
              <label>Group Name *</label>
              <input type="text" placeholder="e.g. Engineering Team" value={groupName}
                onChange={e => { setGroupName(e.target.value); setError(""); }}/>
              {error && <span className="field-error">{error}</span>}
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <input type="text" placeholder="Short description" value={groupDesc}
                onChange={e => setGroupDesc(e.target.value)}/>
            </div>
          </div>
          <div className="inline-form-btns">
            <button className="btn-action" onClick={handleCreate}>Create Group</button>
            <button className="btn-cancel" onClick={() => { setShowCreate(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {groups.length === 0 && !showCreate
        ? <EmptyState icon="group" title="No groups yet" sub="Create a group to start sharing files with multiple employees at once."/>
        : <div className="groups-layout">
            <div className="groups-list">
              {groups.map(g => (
                <div key={g.id}
                  className={`group-card ${selected?.id===g.id?"group-card-active":""}`}
                  onClick={() => setSelected(g)}>
                  <div className="group-card-icon"><Icon d={icons.group} size={18}/></div>
                  <div className="group-card-info">
                    <div className="group-card-name">{g.name}</div>
                    <div className="group-card-meta">{g.members.length} member{g.members.length!==1?"s":""} · {fmtTime(g.createdAt)}</div>
                  </div>
                  <button className="icon-btn-red" onClick={e=>{e.stopPropagation();handleDelete(g.id);}}>
                    <Icon d={icons.trash} size={14}/>
                  </button>
                </div>
              ))}
            </div>

            {selected ? (
              <div className="group-detail">
                <div className="group-detail-header">
                  <div className="group-detail-name">{selected.name}</div>
                  {selected.description && <div className="group-detail-desc">{selected.description}</div>}
                </div>
                <div className="group-member-add">
                  <label>Add Employee (by ID)</label>
                  <div className="group-add-row">
                   <select
                 value={memberInput}
               onChange={(e) => setMemberInput(e.target.value)}
               className="employee-select">
  <option value="">Select Employee</option>

  {employees.map(emp => (
    <option key={emp.id} value={emp.email}>
      {emp.name} ({emp.email})
    </option>
  ))}
</select>
                      {memberInput} {e=>setMemberInput(e.target.value)}
                      {e=>e.key==="Enter"&&handleAddMember()}
                    <button className="btn-action-sm" onClick={handleAddMember}>
                      <Icon d={icons.plus} size={13}/> Add
                    </button>
                  </div>
                  <div className="group-detail-note">
                    <Icon d={icons.info2} size={12}/>
                    Backend connected hone ke baad employee dropdown se select hoga.
                  </div>
                </div>
                <div className="group-members-section">
                  <div className="group-members-title">Members ({selected.members.length})</div>
                  {selected.members.length === 0
                    ? <div className="group-members-empty">No members yet. Add employees above.</div>
                    : selected.members.map((m,i) => (
                        <div key={i} className="group-member-row">
                          <div className="member-avatar">{m[0]?.toUpperCase()}</div>
                          <span className="member-name">{m}</span>
                          <button className="icon-btn-red" onClick={() => handleRemoveMember(m)}>
                            <Icon d={icons.close} size={13}/>
                          </button>
                        </div>
                      ))
                  }
                </div>
              </div>
            ) : (
              <div className="group-detail group-detail-empty">
                <Icon d={icons.group} size={32}/>
                <span>Select a group to manage members</span>
              </div>
            )}
          </div>
      }
    </div>
  );
};

/* UPLOAD FILE */

const UploadPage = ({ files, setFiles, setActive }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const ALLOWED = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // BACKEND UPLOAD FUNCTION
  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("UPLOAD RESPONSE:", data);
    } catch (err) {
      console.log("UPLOAD ERROR:", err);
    }
  };

  const processFiles = (fileList) => {
    setError("");
    const valid = [];
    const errs = [];

    Array.from(fileList).forEach((f) => {
      if (!ALLOWED.includes(f.type)) {
        errs.push(`"${f.name}" — PDF/DOCX only`);
        return;
      }
      if (f.size > 50 * 1024 * 1024) {
        errs.push(`"${f.name}" — Max 50MB`);
        return;
      }
      if (files.find((x) => x.name === f.name)) {
        errs.push(`"${f.name}" — Already uploaded`);
        return;
      }
      valid.push(f);
    });

    if (errs.length) setError(errs.join(" · "));
    if (!valid.length) return;

    const qItems = valid.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      progress: 0,
      status: "uploading",
    }));

    setQueue(qItems);
    setUploading(true);

    qItems.forEach((item, idx) => {
      let p = 0;

      const iv = setInterval(() => {
        p += 12;

        setQueue((prev) =>
          prev.map((q, i) =>
            i === idx ? { ...q, progress: Math.min(p, 100) } : q
          )
        );

        if (p >= 100) {
          clearInterval(iv);

          setQueue((prev) =>
            prev.map((q, i) =>
              i === idx ? { ...q, status: "done" } : q
            )
          );

          // BACKEND UPLOAD
          uploadToBackend(valid[idx]);

          // UI update
          setFiles((prev) => [
            ...prev,
            {
              id: Date.now() + idx,
              name: item.name,
              size: item.size,
              type: item.type,
              uploadedAt: new Date(),
            },
          ]);

          if (idx === qItems.length - 1) setUploading(false);
        }
      }, 80 + idx * 20);
    });
  };
  return (
    <div className="upload-page">
      <div className="upload-card">
        <div className="upload-card-header">
          <h2 className="upload-title">Upload Files</h2>
          <p className="upload-sub">PDF & DOCX · Max 50 MB · Multiple files at once</p>
        </div>
        <div className={`drop-zone ${dragOver?"drop-zone-over":""} ${uploading?"drop-zone-uploading":""}`}
          onClick={()=>!uploading&&inputRef.current.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={e=>{e.preventDefault();setDragOver(false);processFiles(e.dataTransfer.files);}}>
          <input ref={inputRef} type="file" accept=".pdf,.docx" multiple style={{display:"none"}}
            onChange={e=>{processFiles(e.target.files);e.target.value="";}}/>
          <div className="drop-zone-icon"><Icon d={icons.cloudUp} size={36}/></div>
          {uploading
            ? <div className="drop-zone-text">Uploading…</div>
            : <><div className="drop-zone-text">Drag & drop files here</div><div className="drop-zone-sub">or <span className="drop-link">browse</span> · Multiple files supported</div></>
          }
        </div>

        {queue.length > 0 && (
          <div className="upload-queue">
            {queue.map((item,i) => (
              <div key={i} className="queue-item">
                <div className={`file-type-icon ${item.type==="application/pdf"?"icon-pdf":"icon-docx"}`} style={{width:32,height:32,borderRadius:8}}>
                  <Icon d={item.type==="application/pdf"?icons.pdf:icons.docx} size={15}/>
                </div>
                <div className="queue-item-info">
                  <div className="queue-item-name">{item.name}</div>
                  <div className="progress-wrap" style={{marginTop:4}}>
                    <div className="progress-bar" style={{height:5}}><div className="progress-fill" style={{width:item.progress+"%"}}/></div>
                    <span className="progress-pct">{item.progress}%</span>
                  </div>
                </div>
                {item.status==="done" && <span style={{color:"#5dcaa5"}}><Icon d={icons.check} size={16}/></span>}
              </div>
            ))}
          </div>
        )}

        {error && <div className="upload-msg upload-msg-error"><Icon d={icons.alert} size={15}/> {error}</div>}
        {queue.length > 0 && queue.every(q=>q.status==="done") && (
          <div className="upload-msg upload-msg-success">
            <Icon d={icons.check} size={15}/>
            <span>{queue.length} file{queue.length>1?"s":""} uploaded!</span>
            <button className="view-files-btn" onClick={()=>setActive("sharing")}>Share Now →</button>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="upload-recent">
          <div className="upload-recent-title">Recently Uploaded</div>
          {[...files].reverse().slice(0,5).map(f => (
            <div className="upload-recent-item" key={f.id}>
              <div className="ufile-icon"><Icon d={f.type==="application/pdf"?icons.pdf:icons.docx} size={16}/></div>
              <div className="ufile-info">
                <div className="ufile-name">{f.name}</div>
                <div className="ufile-meta">{fmtSize(f.size)} · {fmtTime(f.uploadedAt)}</div>
              </div>
              <span className={`ufile-badge ${f.type==="application/pdf"?"badge-pdf":"badge-docx"}`}>
                {f.type==="application/pdf"?"PDF":"DOCX"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* FILE SHARING */
const FileSharingPage = ({ files, groups }) => {
  const [selectedFile,   setSelectedFile]   = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [shared,         setShared]         = useState([]);
  const [done,           setDone]           = useState(false);

  const toggleGroup = (id) => {
    setSelectedGroups(prev => prev.includes(id) ? prev.filter(g=>g!==id) : [...prev,id]);
    setDone(false);
  };

  const handleShare = () => {
    if (!selectedFile || !selectedGroups.length) return;
    const file = files.find(f=>f.id===selectedFile);
    const grps = groups.filter(g=>selectedGroups.includes(g.id));
    setShared(prev => [{
      id:Date.now(), fileName:file.name, fileType:file.type,
      groups:grps.map(g=>g.name),
      members:grps.reduce((acc,g)=>acc+g.members.length,0),
      sharedAt:new Date(),
    }, ...prev]);
    setSelectedFile(null); setSelectedGroups([]); setDone(true);
    setTimeout(()=>setDone(false),3000);

    // Group memeber collect 
const emails = grps.flatMap(g => g.members || []);

//  request to backend
fetch("http://localhost:5000/api/users/admin/share-file", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    fileName: file.name,
    fileUrl: "http://localhost:5000/uploads/" + file.name,
    emails: emails
  })
})
.then(res => res.json())
.then(data => console.log("FILE SHARED:", data))
.catch(err => console.log("ERROR:", err));
  };

  

  return (
    <div className="sharing-page">
      <div className="sharing-form-card">
        <div className="upload-card-header">
          <h2 className="upload-title">Share File with Groups</h2>
          <p className="upload-sub">Select a file and groups — employees get notified automatically</p>
        </div>

        <div className="form-group">
          <label>Select File *</label>
          {files.length === 0
            ? <div className="sharing-empty-hint"><Icon d={icons.info2} size={14}/> No files yet — upload from Upload File section first.</div>
            : <div className="file-select-list">
                {files.map(f => (
                  <div key={f.id}
                    className={`file-select-item ${selectedFile===f.id?"file-select-active":""}`}
                    onClick={()=>{setSelectedFile(f.id);setDone(false);}}>
                    <div className={`file-type-icon ${f.type==="application/pdf"?"icon-pdf":"icon-docx"}`} style={{width:32,height:32,borderRadius:8}}>
                      <Icon d={f.type==="application/pdf"?icons.pdf:icons.docx} size={15}/>
                    </div>
                    <div style={{flex:1}}>
                      <div className="ufile-name">{f.name}</div>
                      <div className="ufile-meta">{fmtSize(f.size)}</div>
                    </div>
                    {selectedFile===f.id && <Icon d={icons.check} size={16}/>}
                  </div>
                ))}
              </div>
          }
        </div>

        <div className="form-group">
          <label>Share with Groups *</label>
          {groups.length === 0
            ? <div className="sharing-empty-hint"><Icon d={icons.info2} size={14}/> No groups yet — create from Group Management first.</div>
            : <div className="group-select-grid">
                {groups.map(g => (
                  <div key={g.id}
                    className={`group-select-chip ${selectedGroups.includes(g.id)?"chip-active":""}`}
                    onClick={()=>toggleGroup(g.id)}>
                    <Icon d={icons.group} size={14}/>
                    <span>{g.name}</span>
                    <span className="chip-count">{g.members.length}</span>
                    {selectedGroups.includes(g.id) && <Icon d={icons.check} size={12}/>}
                  </div>
                ))}
              </div>
          }
        </div>

        <button
          className={`btn-share ${(!selectedFile||!selectedGroups.length)?"btn-share-disabled":""}`}
          onClick={handleShare} disabled={!selectedFile||!selectedGroups.length}>
          <Icon d={icons.send} size={16}/>
          {selectedGroups.length > 0 ? `Share with ${selectedGroups.length} group${selectedGroups.length>1?"s":""}` : "Select file and group to share"}
        </button>

        {done && (
          <div className="upload-msg upload-msg-success">
            <Icon d={icons.check} size={15}/> File shared! Employees will receive notification.
          </div>
        )}
      </div>

      {shared.length > 0 && (
        <div className="upload-recent">
          <div className="upload-recent-title">Recent Shares</div>
          {shared.map(s => (
            <div className="upload-recent-item" key={s.id}>
              <div className={`ufile-icon ${s.fileType==="application/pdf"?"icon-pdf":"icon-docx"}`}>
                <Icon d={s.fileType==="application/pdf"?icons.pdf:icons.docx} size={16}/>
              </div>
              <div className="ufile-info">
                <div className="ufile-name">{s.fileName}</div>
                <div className="ufile-meta">{s.groups.join(", ")} · {s.members} members · {fmtTime(s.sharedAt)}</div>
              </div>
              <span className="activity-badge activity-badge-upload">Shared</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* FILE TRACKING */
const FileTrackingPage = ({ files, downloadLogs }) => {
  const [tab,    setTab]    = useState("views");
  const [search, setSearch] = useState("");
  const viewLogs    = []; // GET /api/admin/file-views
  const currentLogs = tab==="views" ? viewLogs : downloadLogs;
  const filtered    = currentLogs.filter(l =>
    l.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
    l.fileName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tracking-page">
      <div className="logs-summary-row">
        {[
          { label:"Total Views",     val:viewLogs.length,     color:"teal",   icon:"eye3"     },
          { label:"Total Downloads", val:downloadLogs.length, color:"blue",   icon:"download" },
          { label:"Files Tracked",   val:files.length,        color:"purple", icon:"files"    },
        ].map(s => (
          <div className={`logs-summary-card logs-card-${s.color}`} key={s.label}>
            <div className="logs-summary-icon"><Icon d={icons[s.icon]} size={18}/></div>
            <div><div className="logs-summary-num">{s.val}</div><div className="logs-summary-label">{s.label}</div></div>
          </div>
        ))}
      </div>

      <div className="logs-tabs">
        <button className={`logs-tab ${tab==="views"?"logs-tab-active":""}`} onClick={()=>setTab("views")}>
          <Icon d={icons.eye3} size={15}/> File Views
          {viewLogs.length>0&&<span className="logs-tab-count">{viewLogs.length}</span>}
        </button>
        <button className={`logs-tab ${tab==="downloads"?"logs-tab-active":""}`} onClick={()=>setTab("downloads")}>
          <Icon d={icons.download} size={15}/> Downloads
          {downloadLogs.length>0&&<span className="logs-tab-count">{downloadLogs.length}</span>}
        </button>
      </div>

      <div className="logs-toolbar">
        <div className="files-search-wrap" style={{maxWidth:280}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{position:"absolute",left:12,color:"var(--muted)"}}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="files-search" placeholder="Search employee or file…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      {filtered.length===0
        ? <EmptyState icon={tab==="views"?"eye3":"download"}
            title={tab==="views"?"No view records yet":"No download records yet"}
            sub="Records appear when employees access files. Connect backend API."/>
        : <div className="files-table-wrap">
            <table className="files-table">
              <thead><tr><th>Employee</th><th>File</th><th>Action</th><th>Time</th><th>IP Address</th></tr></thead>
              <tbody>
                {filtered.map(l=>(
                  <tr key={l.id}>
                    <td><div className="log-emp-cell">
                      <div className="log-emp-avatar">{(l.employeeName||"?")[0]}</div>
                      <div><div className="log-emp-name">{l.employeeName||"—"}</div><div className="log-emp-id">{l.employeeId||"—"}</div></div>
                    </div></td>
                    <td className="file-name-text" style={{fontSize:12}}>{l.fileName||"—"}</td>
                    <td><span className={`activity-badge ${tab==="views"?"activity-badge-view":"activity-badge-download"}`}>{tab==="views"?"Viewed":"Downloaded"}</span></td>
                    <td className="file-meta-cell">{l.downloadedAt||l.viewedAt||"—"}</td>
                    <td className="file-meta-cell log-mono">{l.ipAddress||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
      <div className="logs-backend-note">
        <Icon d={icons.info2} size={13}/>
        <span>Connect <code>GET /api/admin/file-views</code> and <code>GET /api/admin/download-logs</code>.</span>
      </div>
    </div>
  );
};

/* MANAGE EMPLOYEES */
const ManageEmployees = () => (
  <div className="placeholder-page">
    <div className="placeholder-icon"><Icon d={icons.employees} size={40}/></div>
    <h2>Manage Employees</h2>
    <p>Connect backend to manage employees.</p>
    <div className="logs-backend-note" style={{marginTop:16,maxWidth:420}}>
      <Icon d={icons.info2} size={13}/>
      <span>Connect <code>GET /api/admin/employees</code> — activate/deactivate, view department info.</span>
    </div>
  </div>
);

/* EMPLOYEE ACTIVITY  */
const EmployeeActivityPage = () => {
  const loginHistory = []; // GET /api/admin/activity/login-history pending
  return (
    <div className="tracking-page">
      <div className="logs-summary-row">
        {[
          { label:"Login Events", val:loginHistory.length, color:"blue", icon:"login"     },
          { label:"Active Today", val:"—",                 color:"teal", icon:"employees" },
        ].map(s=>(
          <div className={`logs-summary-card logs-card-${s.color}`} key={s.label}>
            <div className="logs-summary-icon"><Icon d={icons[s.icon]} size={18}/></div>
            <div><div className="logs-summary-num">{s.val}</div><div className="logs-summary-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="dashboard-card">
        <div className="card-header"><h3 className="card-title">Login History</h3></div>
        {loginHistory.length===0
          ? <EmptyState icon="login" title="No login records yet" sub="Employee login/logout events will appear here. Connect backend API."/>
          : null
        }
      </div>
      <div className="logs-backend-note">
        <Icon d={icons.info2} size={13}/>
        <span>Connect <code>GET /api/admin/activity/login-history</code> to show employee login events.</span>
      </div>
    </div>
  );
};

/* DOWNLOAD LOGS */
const DownloadLogsPage = ({ downloadLogs, shareAlerts }) => {
  const [tab,    setTab]    = useState("downloads");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const now=new Date(), startOfDay=new Date(now.getFullYear(),now.getMonth(),now.getDate()), startOfWeek=new Date(now-7*86400000);

  const filteredLogs = downloadLogs.filter(l=>{
    const ms=l.employeeName?.toLowerCase().includes(search.toLowerCase())||l.fileName?.toLowerCase().includes(search.toLowerCase());
    const d=new Date(l.downloadedAt);
    return ms&&(filter==="all"?true:filter==="today"?d>=startOfDay:d>=startOfWeek);
  });
  const filteredAlerts = shareAlerts.filter(a=>a.employeeName?.toLowerCase().includes(search.toLowerCase())||a.fileName?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="logs-page">
      <div className="logs-summary-row">
        {[
          {label:"Total Downloads",  val:downloadLogs.length,                                    color:"blue",  icon:"download"},
          {label:"Share Attempts",   val:shareAlerts.length,                                     color:"amber", icon:"share"  },
          {label:"Downloads Today",  val:downloadLogs.filter(l=>new Date(l.downloadedAt)>=startOfDay).length, color:"teal",  icon:"activity"},
          {label:"Unresolved Alerts",val:shareAlerts.filter(a=>!a.resolved).length,              color:"red",   icon:"alert"  },
        ].map(s=>(
          <div className={`logs-summary-card logs-card-${s.color}`} key={s.label}>
            <div className="logs-summary-icon"><Icon d={icons[s.icon]} size={18}/></div>
            <div><div className="logs-summary-num">{s.val}</div><div className="logs-summary-label">{s.label}</div></div>
          </div>
        ))}
      </div>
      <div className="logs-tabs">
        <button className={`logs-tab ${tab==="downloads"?"logs-tab-active":""}`} onClick={()=>setTab("downloads")}>
          <Icon d={icons.download} size={15}/> Download Logs {downloadLogs.length>0&&<span className="logs-tab-count">{downloadLogs.length}</span>}
        </button>
        <button className={`logs-tab ${tab==="shares"?"logs-tab-active":""}`} onClick={()=>setTab("shares")}>
          <Icon d={icons.share} size={15}/> Share Attempts {shareAlerts.filter(a=>!a.resolved).length>0&&<span className="logs-tab-count logs-tab-count-red">{shareAlerts.filter(a=>!a.resolved).length}</span>}
        </button>
      </div>
      <div className="logs-toolbar">
        <div className="files-search-wrap" style={{maxWidth:280}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{position:"absolute",left:12,color:"var(--muted)"}}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="files-search" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {tab==="downloads"&&<div className="files-filter-group">
          {[["all","All Time"],["today","Today"],["week","This Week"]].map(([v,l])=>(
            <button key={v} className={`filter-btn ${filter===v?"filter-btn-active":""}`} onClick={()=>setFilter(v)}>{l}</button>
          ))}
        </div>}
      </div>
      {tab==="downloads"&&(filteredLogs.length===0
        ?<EmptyState icon="download" title="No downloads yet" sub="Downloads appear when employees download files."/>
        :<div className="files-table-wrap"><table className="files-table">
          <thead><tr><th>Employee</th><th>File</th><th>Type</th><th>Downloaded At</th><th>IP</th><th>Device</th></tr></thead>
          <tbody>{filteredLogs.map(l=>(
            <tr key={l.id}>
              <td><div className="log-emp-cell"><div className="log-emp-avatar">{(l.employeeName||"?")[0]}</div><div><div className="log-emp-name">{l.employeeName||"—"}</div><div className="log-emp-id">{l.employeeId||"—"}</div></div></div></td>
              <td><div className="file-name-cell"><div className={`file-type-icon ${l.fileType==="pdf"?"icon-pdf":"icon-docx"}`} style={{width:26,height:26,borderRadius:6}}><Icon d={l.fileType==="pdf"?icons.pdf:icons.docx} size={13}/></div><span style={{fontSize:12}}>{l.fileName||"—"}</span></div></td>
              <td><span className={`ufile-badge ${l.fileType==="pdf"?"badge-pdf":"badge-docx"}`}>{(l.fileType||"?").toUpperCase()}</span></td>
              <td className="file-meta-cell">{l.downloadedAt||"—"}</td>
              <td className="file-meta-cell log-mono">{l.ipAddress||"—"}</td>
              <td className="file-meta-cell log-mono">{l.deviceId||"—"}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      {tab==="shares"&&(filteredAlerts.length===0
        ?<EmptyState icon="share" title="No share attempts" sub="Share attempt alerts appear automatically."/>
        :<div className="files-table-wrap"><table className="files-table">
          <thead><tr><th>Employee</th><th>File</th><th>Attempt</th><th>Detected At</th><th>Risk</th><th>Status</th></tr></thead>
          <tbody>{filteredAlerts.map(a=>(
            <tr key={a.id}>
              <td><div className="log-emp-cell"><div className="log-emp-avatar log-emp-avatar-red">{(a.employeeName||"?")[0]}</div><div><div className="log-emp-name">{a.employeeName||"—"}</div><div className="log-emp-id">{a.employeeId||"—"}</div></div></div></td>
              <td style={{fontSize:12}}>{a.fileName||"—"}</td>
              <td><span className="share-type-badge">{a.attemptType||"Share"}</span></td>
              <td className="file-meta-cell">{a.detectedAt||"—"}</td>
              <td><span className={`severity-badge severity-${a.riskLevel||"high"}`}>{a.riskLevel||"high"}</span></td>
              <td>{a.resolved?<span className="resolved-tag">Resolved</span>:<span className="unresolved-tag">Active</span>}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
      <div className="logs-backend-note">
        <Icon d={icons.info2} size={13}/>
        <span>Connect <code>GET /api/admin/download-logs</code> and <code>GET /api/admin/share-alerts</code>.</span>
      </div>
    </div>
  );
};

/* LEAK DETECTION */
const LeakDetectionPage = () => {
  const inputRef=useRef();
  const [step,setProg2]=useState("idle"),[file,setFile]=useState(null),[progress,setProg]=useState(0);
  const [dragOver,setDrag]=useState(false),[result,setResult]=useState(null),[copied,setCopied]=useState(false),[history,setHist]=useState([]);
  const ALLOWED=["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  const handleFile=(f)=>{if(!ALLOWED.includes(f.type)){alert("PDF or DOCX only.");return;}setFile(f);setProg2("file-selected");setResult(null);};
  const startAnalysis=()=>{
    setProg2("analyzing");setProg(0);let i=0;
    const iv=setInterval(()=>{
      if(i>=6){clearInterval(iv);
        const r={found:true,employeeId:"EMP-"+Math.floor(1000+Math.random()*9000),employeeName:"Rahul Sharma",department:"Engineering",
          downloadedAt:new Date(Date.now()-Math.random()*86400000*7).toLocaleString("en-IN"),fileId:"FILE-"+Math.floor(10000+Math.random()*90000),
          fileName:file.name,ipAddress:`192.168.${Math.floor(1+Math.random()*50)}.${Math.floor(10+Math.random()*240)}`,
          deviceId:"WIN-"+Math.random().toString(36).substr(2,8).toUpperCase(),riskLevel:"high",analyzedAt:new Date().toLocaleString("en-IN")};
        setResult(r);setHist(h=>[{id:Date.now(),fileName:file.name,...r},...h]);setProg2("result");return;
      }
      setProg([15,35,55,75,90,100][i]);i++;
    },480);
  };
  const reset=()=>{setProg2("idle");setFile(null);setProg(0);setResult(null);setCopied(false);};
  const copyReport=()=>{if(!result)return;navigator.clipboard.writeText(`SecureDocs Report\nFile: ${result.fileName}\nEmployee: ${result.employeeName} (${result.employeeId})\nDownloaded: ${result.downloadedAt}\nIP: ${result.ipAddress}`).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});};

  return (
    <div className="leak-page">
      <div className="leak-main">
        <div className="leak-header-card">
          <div className="leak-header-icon"><Icon d={icons.leak} size={22}/></div>
          <div><h2 className="leak-title">Watermark Decrypt & Leak Analysis</h2><p className="leak-subtitle">Upload a suspected leaked file to identify the source employee.</p></div>
        </div>
        {step==="idle"&&<div className="leak-card">
          <div className="leak-card-label"><Icon d={icons.cloudUp} size={14}/> Upload suspected file</div>
          <div className={`drop-zone leak-drop ${dragOver?"drop-zone-over":""}`}
            onClick={()=>inputRef.current.click()}
            onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f)handleFile(f);}}>
            <input ref={inputRef} type="file" accept=".pdf,.docx" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(f)handleFile(f);e.target.value="";}}/>
            <div className="leak-drop-icon"><Icon d={icons.unlock} size={32}/></div>
            <div className="drop-zone-text">Drop leaked file here</div>
            <div className="drop-zone-sub">or <span className="drop-link">browse</span> · PDF / DOCX</div>
          </div>
        </div>}
        {step==="file-selected"&&<div className="leak-card">
          <div className="selected-file-box">
            <div className={`file-type-icon ${file.type==="application/pdf"?"icon-pdf":"icon-docx"}`} style={{width:44,height:44,borderRadius:12}}><Icon d={file.type==="application/pdf"?icons.pdf:icons.docx} size={20}/></div>
            <div style={{flex:1}}><div className="selected-file-name">{file.name}</div><div className="selected-file-meta">{fmtSize(file.size)}</div></div>
            <button className="icon-clear-btn" onClick={reset}><Icon d={icons.close} size={14}/></button>
          </div>
          <div className="analyze-btn-row">
            <button className="btn-analyze" onClick={startAnalysis}><Icon d={icons.scan} size={16}/> Start Analysis</button>
            <button className="btn-cancel-analyze" onClick={reset}>Cancel</button>
          </div>
        </div>}
        {step==="analyzing"&&<div className="leak-card">
          <div className="analyzing-wrap">
            <div className="analyzing-icon-ring"><div className="analyzing-spinner"/><div className="analyzing-icon-inner"><Icon d={icons.unlock} size={24}/></div></div>
            <div className="analyzing-file-name">{file?.name}</div>
            <div className="analyzing-step-label">{progress<20&&"Reading metadata…"}{progress>=20&&progress<40&&"Extracting watermark…"}{progress>=40&&progress<60&&"Decrypting token…"}{progress>=60&&progress<80&&"Matching database…"}{progress>=80&&progress<100&&"Generating report…"}{progress>=100&&"Done!"}</div>
            <div className="analyzing-progress-wrap">
              <div className="progress-bar" style={{height:8,borderRadius:6}}><div className="progress-fill" style={{width:progress+"%",background:"linear-gradient(90deg,#e24b4a,#ef9f27)"}}/></div>
              <span className="progress-pct">{progress}%</span>
            </div>
          </div>
        </div>}
        {step==="result"&&result&&<div className="leak-card result-card">
          <div className="result-header">
            <div className="result-found-icon"><Icon d={icons.alert} size={20}/></div>
            <div><div className="result-found-label">Leaker Identified</div><div className="result-found-file">{result.fileName}</div></div>
            <span className={`risk-badge risk-${result.riskLevel}`}>{result.riskLevel} risk</span>
          </div>
          <div className="result-section-title">Employee Identity</div>
          <div className="result-identity-grid">
            {[["Employee ID",result.employeeId,"result-emp-id"],["Name",result.employeeName,""],["Department",result.department,""],["Downloaded At",result.downloadedAt,""]].map(([k,v,cls])=>(
              <div className="result-field" key={k}><div className="result-field-label">{k}</div><div className={`result-field-value ${cls}`}>{v}</div></div>
            ))}
          </div>
          <div className="result-section-title">Technical Details</div>
          <div className="result-tech-grid">
            {[["File ID",result.fileId],["IP Address",result.ipAddress],["Device ID",result.deviceId],["Analyzed At",result.analyzedAt]].map(([k,v])=>(
              <div className="result-tech-item" key={k}><span className="result-tech-label">{k}</span><span className="result-tech-value mono">{v}</span></div>
            ))}
          </div>
          <div className="result-actions">
            <button className="btn-copy-report" onClick={copyReport}><Icon d={copied?icons.check:icons.copy} size={15}/>{copied?"Copied!":"Copy Report"}</button>
            <button className="btn-analyze-again" onClick={reset}><Icon d={icons.reset} size={15}/> Analyze Another</button>
          </div>
        </div>}
      </div>
      <div className="leak-history">
        <div className="leak-history-header"><Icon d={icons.history} size={15}/><span>History</span>{history.length>0&&<span className="history-count">{history.length}</span>}</div>
        {history.length===0?<div className="leak-history-empty"><Icon d={icons.history} size={22}/><span>No analyses yet</span></div>
          :history.map(h=><div className="history-item" key={h.id}>
            <div className="history-item-top"><span className="history-file-name">{h.fileName}</span><span className={`risk-badge risk-${h.riskLevel}`} style={{fontSize:9}}>{h.riskLevel}</span></div>
            <div className="history-item-meta"><span className="result-emp-id" style={{fontSize:11}}>{h.employeeId}</span><span style={{color:"var(--muted2)"}}> · </span><span style={{color:"var(--muted)",fontSize:11}}>{h.employeeName}</span></div>
            <div className="history-item-time">{h.analyzedAt}</div>
          </div>)
        }
      </div>
    </div>
  );
};
// ══════════════════════════════════════════════════════════════════
// ADMIN — COMPLETE TASK MANAGEMENT (Full Flow)
//
// HOW TO ADD IN AdminDashboard.jsx:
//
// 1. icons object mein add karo:
//   tasks:    ["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"],
//   calendar: ["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"],
//   thumbUp:  ["M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z","M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"],
//   thumbDown:["M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z","M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"],
//
// 2. navItems mein add karo (leak ke pehle):
//   { key: "tasks", label: "Task Management", icon: "tasks" },
//
// 3. AdminDashboard main component mein yeh state add karo:
//   const [tasks, setTasks] = useState([]);
//   const [taskNotifs, setTaskNotifs] = useState([]); // submitted tasks notifications
//
// 4. renderContent() mein add karo:
//   case "tasks": return <TaskManagementPage groups={groups} files={files} tasks={tasks} setTasks={setTasks} taskNotifs={taskNotifs} setTaskNotifs={setTaskNotifs} setActive={setActive}/>;
//
// 5. TopBar mein taskNotifs.filter(n=>!n.seen).length pass karo as taskNotifCount
//
// ══════════════════════════════════════════════════════════════════

/* ══ ADMIN TASK MANAGEMENT PAGE ════════════════════════════════════ */
const TaskManagementPage = ({  groups = [],
  files = [],
  tasks = [],
  setTasks,
  taskNotifs = [],
  setTaskNotifs,
  setActive
}) => {
  const [tab, setTab] = useState("create"); // create | view | submissions

  // ── Create Task form state
  const [form, setForm] = useState({
    title: "", description: "", assignTo: "all",
    fileId: "", deadline: "", priority: "medium",
  });
  const [formError,   setFormError]   = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // ── Review submission modal
  const [reviewSub,   setReviewSub]   = useState(null); // { task, submission }
  const [rejectNote,  setRejectNote]  = useState("");
  const [reviewError, setReviewError] = useState("");

  // ── Submission filter
  const [subFilter, setSubFilter] = useState("all"); // all | pending | approved | rejected
  const [viewTask,  setViewTask]  = useState(null);

  const priorityColor = { low:"#5dcaa5", medium:"#ef9f27", high:"#e24b4a" };
  const priorityBg    = { low:"rgba(29,158,117,0.12)", medium:"rgba(239,159,39,0.12)", high:"rgba(226,75,74,0.12)" };

  /* Create task */
  const handleCreate = () => {
    setFormError("");
    if (!form.title.trim()) { setFormError("Task title is required."); return; }
    if (!form.deadline)     { setFormError("Deadline is required.");   return; }

    const attachedFile = files.find(f => f.id === form.fileId) || null;
    const groupLabel   = form.assignTo === "all"
      ? "All Employees"
      : groups.find(g => g.id === parseInt(form.assignTo))?.name || "Unknown";

    const newTask = {
      id:          Date.now(),
      title:       form.title.trim(),
      description: form.description.trim(),
      assignTo: form.assignTo === "all"
  ? "all"
  : groups.find(g => g.id === parseInt(form.assignTo))?.members || [],
      assignLabel: groupLabel,
      file:        attachedFile,
      deadline:    form.deadline,
      priority:    form.priority,
      createdAt:   new Date(),
      submissions: [],
    };

    let assignEmails = [];

if (form.assignTo === "all") {
  assignEmails = ["all"];
} else {

  const selectedGroup = groups.find(
    g => g.id === parseInt(form.assignTo)
  );

  assignEmails = selectedGroup?.members || [];
}

    setTasks(prev => [newTask, ...prev]);
    fetch("http://localhost:5000/api/users/admin/tasks", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },

  body: JSON.stringify({
    title: newTask.title,
    description: newTask.description,
assignTo: assignEmails,    priority: newTask.priority,
    fileName: newTask.file?.name || "",
    issueDate: newTask.issueDate,
    deadline: newTask.deadline
  })
})
.then(res => res.json())
.then(data => {
  console.log("TASK CREATED:", data);
})
.catch(err => {
  console.log("TASK ERROR:", err);
});
    setForm({ title:"", description:"", assignTo:"all", fileId:"", deadline:"", priority:"medium" });
    setFormSuccess(true);
    setTimeout(() => { setFormSuccess(false); setTab("view"); }, 2000);

    /* Backend:
    fetch("http://localhost:5000/api/admin/tasks", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(newTask)
    }); */
  };

  /* Approve submission */
  const handleApprove = (taskId, subId) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        submissions: t.submissions.map(s =>
          s.id === subId ? { ...s, status:"approved", reviewedAt: new Date() } : s
        ),
      };
    }));

    fetch(`http://localhost:5000/api/users/admin/approve-submission/${subId}`, {
  method: "PUT"

  
})
.then(res => res.json())
.then(data => {
  console.log("APPROVED:", data);
})
.catch(err => console.log(err));


    // Mark notif as actioned
    setTaskNotifs(prev => prev.map(n =>
      n.subId === subId ? { ...n, seen: true, actioned: true } : n
    ));
    setReviewSub(null);

    /* Backend:
    fetch(`http://localhost:5000/api/admin/tasks/submissions/${subId}/approve`, { method:"PUT" }); */
  };

  /* Reject submission */
  const handleReject = (taskId, subId) => {
    if (!rejectNote.trim()) { setReviewError("Please add a reason for rejection."); return; }
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        submissions: t.submissions.map(s =>
          s.id === subId ? { ...s, status:"rejected", rejectNote, reviewedAt: new Date() } : s
        ),
      };
    }));
    setTaskNotifs(prev => prev.map(n =>
      n.subId === subId ? { ...n, seen: true, actioned: true } : n
    ));
    setRejectNote(""); setReviewError(""); setReviewSub(null);

   fetch(`http://localhost:5000/api/users/admin/reject-submission/${subId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    rejectNote: rejectNote
  })
})

.then(res => res.json())

.then(data => {

  console.log("REJECT RESPONSE:", data);

  // 👇 YE YAHA HOGA
  setRejectNote("");
  setReviewError("");
  setReviewSub(null);

})

.catch(err => {
  console.log("REJECT ERROR:", err);
});
  }

  // All submissions across all tasks (flattened)
  const allSubmissions = tasks.flatMap(t =>
    t.submissions.map(s => ({ ...s, taskTitle: t.title, taskId: t.id }))
  );
  const pendingReview = allSubmissions.filter(s => s.status === "pending");

  const filteredSubs = allSubmissions.filter(s =>
    subFilter === "all" ? true : s.status === subFilter
  );

  const statusColor = { pending:"#ef9f27", approved:"#5dcaa5", rejected:"#e24b4a" };
  const statusBg    = { pending:"rgba(239,159,39,0.12)", approved:"rgba(29,158,117,0.12)", rejected:"rgba(226,75,74,0.12)" };

  return (
    <div className="task-page">

      {/* ── Header ── */}
      <div className="task-page-header">
        <div>
          <div className="page-header-title">Task Management</div>
          <div className="page-header-sub">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""} ·{" "}
            {pendingReview.length > 0
              ? <span style={{color:"#ef9f27"}}>{pendingReview.length} pending review</span>
              : "All reviewed"}
          </div>
        </div>
        <div className="task-tab-group">
          {[
            { key:"create",      label:"Create Task",      icon:"plus"     },
            { key:"view",        label:"View Tasks",       icon:"files"    },
            { key:"submissions", label:"Submissions",      icon:"download" ,
              badge: pendingReview.length > 0 ? pendingReview.length : null },
          ].map(t => (
            <button key={t.key}
              className={`task-tab-btn ${tab === t.key ? "task-tab-btn-active" : ""}`}
              onClick={() => setTab(t.key)}>
              <Icon d={icons[t.icon]} size={14}/> {t.label}
              {t.badge && <span className="task-tab-badge">{t.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ══ CREATE TASK ══ */}
      {tab === "create" && (
        <div className="task-create-card">
          <div className="task-create-title">
            <Icon d={icons.plus} size={16}/> Create New Task
          </div>

          <div className="task-form-grid">
            <div className="form-group task-form-full">
              <label>Task Title *</label>
              <input type="text" placeholder="e.g. Review Q3 report and submit feedback"
                value={form.title} onChange={e => setForm({...form, title:e.target.value})}/>
            </div>
            <div className="form-group task-form-full">
              <label>Task Description *</label>
              <textarea rows={4}
                placeholder="Describe clearly what the employee needs to do, what to submit, and any specific instructions…"
                value={form.description} onChange={e => setForm({...form, description:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Assign To *</label>
              <select value={form.assignTo} onChange={e => setForm({...form, assignTo:e.target.value})}>
                <option value="all">All Employees</option>
                {groups.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.members.length} members)</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority:e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Attach Reference File (optional)</label>
              <select value={form.fileId} onChange={e => setForm({...form, fileId:e.target.value})}>
                <option value="">No file</option>
                {files.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Submission Deadline *</label>
              <input type="datetime-local" value={form.deadline}
                min={new Date().toISOString().slice(0,16)}
                onChange={e => setForm({...form, deadline:e.target.value})}/>
            </div>
          </div>

          {formError   && <div className="task-form-error"><Icon d={icons.alert} size={13}/> {formError}</div>}
          {formSuccess  && <div className="task-form-success"><Icon d={icons.check} size={13}/> Task created! Switching to View Tasks…</div>}

          <div className="task-form-actions">
            <button className="btn-action" onClick={handleCreate}>
              <Icon d={icons.send} size={15}/> Assign Task
            </button>
            <button className="btn-cancel"
              onClick={() => setForm({title:"",description:"",assignTo:"all",fileId:"",deadline:"",priority:"medium"})}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ══ VIEW TASKS ══ */}
      {tab === "view" && (
        <div className="task-list-wrap">
          {tasks.length === 0
            ? <EmptyState icon="files" title="No tasks yet"
                sub="Create a task from the 'Create Task' tab to assign work to employees."/>
            : tasks.map(task => {
                const pendingSubs = task.submissions.filter(s => s.status === "pending").length;
                const isOverdue   = new Date(task.deadline) < new Date();
                return (
                  <div className="task-card" key={task.id}>
                    <div className="task-card-top">
                      <div className="task-card-left">
                        <div className="task-priority-dot" style={{background: priorityColor[task.priority]}}/>
                        <div className="task-card-title">{task.title}</div>
                        <span className="task-priority-badge"
                          style={{background:priorityBg[task.priority],color:priorityColor[task.priority],border:`1px solid ${priorityColor[task.priority]}40`}}>
                          {task.priority}
                        </span>
                        {isOverdue && <span className="task-overdue-tag">Overdue</span>}
                      </div>
                      <div className="task-card-actions">
                        {pendingSubs > 0 && (
                          <button className="task-review-btn"
                            onClick={() => { setViewTask(task.id); setTab("submissions"); }}>
                            <Icon d={icons.alert} size={13}/>
                            Review {pendingSubs} submission{pendingSubs > 1 ? "s" : ""}
                          </button>
                        )}
                        <button className="task-view-sub-btn"
                          onClick={() => { setViewTask(task.id); setTab("submissions"); }}>
                          <Icon d={icons.eye3} size={13}/>
                          {task.submissions.length} sub{task.submissions.length !== 1 ? "s" : ""}
                        </button>
                        <button className="icon-btn-red"
                          onClick={() => { if(window.confirm("Delete task?")) setTasks(p=>p.filter(t=>t.id!==task.id)); }}>
                          <Icon d={icons.trash} size={14}/>
                        </button>
                      </div>
                    </div>

                    {task.description && <div className="task-card-desc">{task.description}</div>}

                    <div className="task-card-meta">
                      <div className="task-meta-item"><Icon d={icons.group} size={12}/><span>{task.assignLabel}</span></div>
                      <div className="task-meta-item"><Icon d={icons.calendar} size={12}/>
                        <span>Due: {new Date(task.deadline).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                      </div>
                      {task.file && <div className="task-meta-item"><Icon d={task.file.type==="application/pdf"?icons.pdf:icons.docx} size={12}/><span>{task.file.name}</span></div>}
                      <div className="task-meta-item">
                        <span style={{color:"#5dcaa5"}}>{task.submissions.filter(s=>s.status==="approved").length} approved</span>
                        {task.submissions.filter(s=>s.status==="pending").length > 0 &&
                          <span style={{color:"#ef9f27", marginLeft:8}}>{task.submissions.filter(s=>s.status==="pending").length} pending</span>}
                        {task.submissions.filter(s=>s.status==="rejected").length > 0 &&
                          <span style={{color:"#e24b4a", marginLeft:8}}>{task.submissions.filter(s=>s.status==="rejected").length} rejected</span>}
                      </div>
                    </div>
                  </div>
                );
              })
          }
        </div>
      )}

      {/* ══ SUBMISSIONS ══ */}
      {tab === "submissions" && (
        <div className="task-submissions-wrap">
          {/* Filter row */}
          <div className="task-sub-filter-row">
            <div className="files-filter-group">
              {[["all","All"],["pending","Pending Review"],["approved","Approved"],["rejected","Rejected"]].map(([v,l]) => (
                <button key={v} className={`filter-btn ${subFilter===v?"filter-btn-active":""}`}
                  onClick={() => setSubFilter(v)}>{l}
                  {v==="pending" && pendingReview.length > 0 &&
                    <span className="task-tab-badge" style={{marginLeft:4}}>{pendingReview.length}</span>}
                </button>
              ))}
            </div>
            {/* Task selector */}
            <select className="task-select-dropdown"
              value={viewTask || ""}
              onChange={e => setViewTask(e.target.value ? parseInt(e.target.value) : null)}>
              <option value="">All Tasks</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
          </div>

          {filteredSubs.length === 0 ? (
            <EmptyState icon="download" title="No submissions"
              sub={subFilter === "all" ? "Submissions will appear here when employees submit tasks." : `No ${subFilter} submissions.`}/>
          ) : (
            filteredSubs
              .filter(s => !viewTask || s.taskId === viewTask)
              .map(sub => (
                <div className="task-sub-card" key={sub.id}>
                  <div className="task-sub-card-top">
                    <div className="task-sub-card-left">
                      <div className="log-emp-avatar" style={{background:"rgba(79,138,255,0.15)",color:"#7eb3ff",width:36,height:36,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>
                        {(sub.empName||"?")[0]}
                      </div>
                      <div>
                        <div className="task-sub-emp-name">{sub.empName || "Unknown"}</div>
                        <div className="task-sub-emp-id">{sub.empId || "—"} · {sub.taskTitle}</div>
                      </div>
                    </div>
                    <span className="task-status-badge"
                      style={{background:statusBg[sub.status],color:statusColor[sub.status],border:`1px solid ${statusColor[sub.status]}40`}}>
                      {sub.status === "pending" ? "● Pending Review"
                        : sub.status === "approved" ? "✓ Approved"
                        : "✗ Rejected"}
                    </span>
                  </div>

                  {/* Description preview */}
                  {sub.description && (
                    <div className="task-sub-desc-preview">
                      <span className="task-sub-desc-label">Submission note:</span>
                      "{sub.description}"
                    </div>
                  )}

                  <div className="task-sub-meta-row">
                    <span className="task-meta-item"><Icon d={icons.calendar} size={12}/>
                      {new Date(sub.submittedAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                    </span>
                    {sub.fileName && (
                      <span className="task-meta-item">
                        <Icon d={icons.download} size={12}/>
                        <a href={sub.fileUrl} target="_blank" rel="noreferrer" style={{color:"#7eb3ff"}}>{sub.fileName}</a>
                      </span>
                    )}
                    {sub.reviewedAt && (
                      <span className="task-meta-item" style={{color:"rgba(180,205,240,0.35)"}}>
                        Reviewed: {new Date(sub.reviewedAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
                      </span>
                    )}
                  </div>

                  {/* Reject reason */}
                  {sub.status === "rejected" && sub.rejectNote && (
                    <div className="task-reject-note">
                      <Icon d={icons.info2} size={12}/> Reason: {sub.rejectNote}
                    </div>
                  )}

                  {/* Actions — only for pending */}
                  {sub.status === "pending" && (
                    <div className="task-sub-actions">
                      <button className="task-btn-approve"
                        onClick={() => handleApprove(sub.taskId, sub.id)}>
                        <Icon d={icons.thumbUp} size={14}/> Approve
                      </button>
                      <button className="task-btn-reject"
                        onClick={() => { setReviewSub(sub); setRejectNote(""); setReviewError(""); }}>
                        <Icon d={icons.thumbDown} size={14}/> Reject
                      </button>
                      <button className="task-btn-fullreview"
                        onClick={() => { setReviewSub(sub); setRejectNote(""); setReviewError(""); }}>
                        <Icon d={icons.eye3} size={13}/> Full Review
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}

      {/* ══ REVIEW MODAL ══ */}
      {reviewSub && (
        <div className="task-modal-overlay" onClick={e => e.target===e.currentTarget && setReviewSub(null)}>
          <div className="task-review-modal">
            <div className="task-modal-header">
              <div className="task-modal-title">Review Submission</div>
              <button className="fv-close-btn" onClick={() => setReviewSub(null)}>
                <Icon d={icons.close} size={16}/>
              </button>
            </div>

            <div className="task-modal-body">
              {/* Employee info */}
              <div className="task-review-emp-row">
                <div className="log-emp-avatar" style={{width:44,height:44,borderRadius:12,background:"rgba(79,138,255,0.15)",color:"#7eb3ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700}}>
                  {(reviewSub.empName||"?")[0]}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:"#e4ecfa"}}>{reviewSub.empName || "Unknown"}</div>
                  <div style={{fontSize:12,color:"rgba(180,205,240,0.45)"}}>{reviewSub.empId} · {reviewSub.taskTitle}</div>
                  <div style={{fontSize:11,color:"rgba(180,205,240,0.3)",marginTop:2}}>
                    Submitted: {new Date(reviewSub.submittedAt).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              {/* Submission description */}
              {reviewSub.description && (
                <div className="task-review-section">
                  <div className="task-review-section-label">Employee's Description</div>
                  <div className="task-review-description">"{reviewSub.description}"</div>
                </div>
              )}

              {/* Submitted file */}
              {reviewSub.fileName && (
                <div className="task-review-section">
                  <div className="task-review-section-label">Submitted File</div>
                  <a className="task-review-file-btn" href={reviewSub.fileUrl} target="_blank" rel="noreferrer">
                    <Icon d={icons.download} size={15}/>
                    <span>{reviewSub.fileName}</span>
                    <span style={{fontSize:11,opacity:0.5,marginLeft:"auto"}}>Click to open</span>
                  </a>
                </div>
              )}

              {/* Reject reason input */}
              <div className="task-review-section">
                <div className="task-review-section-label">Rejection Reason (required for reject)</div>
                <textarea className="task-review-textarea" rows={3}
                  placeholder="Explain why this submission is rejected and what needs to be corrected…"
                  value={rejectNote} onChange={e => { setRejectNote(e.target.value); setReviewError(""); }}/>
                {reviewError && <div className="task-form-error" style={{marginTop:6}}><Icon d={icons.alert} size={12}/> {reviewError}</div>}
              </div>

              {/* Action buttons */}
              <div className="task-review-action-row">
                <button className="task-btn-approve task-btn-approve-lg"
                  onClick={() => handleApprove(reviewSub.taskId, reviewSub.id)}>
                  <Icon d={icons.thumbUp} size={16}/> Approve Submission
                </button>
                <button className="task-btn-reject task-btn-reject-lg"
                  onClick={() => handleReject(reviewSub.taskId, reviewSub.id)}>
                  <Icon d={icons.thumbDown} size={16}/> Reject & Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




/* MAIN */
const AdminDashboard = () => {
  const [active,       setActive]       = useState("dashboard");
  const [collapsed,    setCollapsed]    = useState(false);
  const [files,        setFiles]        = useState([]);
  const [groups,       setGroups]       = useState([]);
  const [downloadLogs, setDownloadLogs] = useState([]);
  const [shareAlerts,  setShareAlerts]  = useState([]);
  const [tasks,      setTasks]      = useState([]);
  const [taskNotifs, setTaskNotifs] = useState([]);

  useEffect(() => {

  const fetchNotifications = () => {

    fetch("http://localhost:5000/api/users/employee/notifications/admin@gmail.com")

      .then(res => res.json())

      .then(data => {

        console.log("ADMIN NOTIFICATIONS:", data);

        const formatted = data.map(item => ({

          id: item.id,
          message: item.message,
          createdAt: item.created_at

        }));

        setTaskNotifs(formatted);

      })

      .catch(err => console.log("ERROR:", err));

  };

  // first load
  fetchNotifications();

  // auto refresh every 3 sec
  const interval = setInterval(() => {

    fetchNotifications();

  }, 3000);

  return () => clearInterval(interval);

}, []);

useEffect(() => {

  const fetchSubmissions = () => {

    fetch("http://localhost:5000/api/users/admin/task-submissions")

      .then(res => res.json())

      .then(data => {

        console.log("SUBMISSIONS:", data);

        const groupedTasks = [];

        data.forEach(item => {

          const existingTask = groupedTasks.find(
            t => t.id === item.task_id
          );

          const submission = {

            id: item.id,

            empName: item.employee_name,

            empId: item.employee_email,

            description: item.description,

            fileName: item.file_name,

            fileUrl: item.file_url,

            status: item.status,

            submittedAt: item.submitted_at,

            reviewedAt: item.reviewed_at,

            rejectNote: item.reject_note

          };

          if (existingTask) {

            existingTask.submissions.push(submission);

          } else {

            groupedTasks.push({

              id: item.task_id,

              title: item.task_title || "Task",

              submissions: [submission]

            });

          }

        });

        setTasks(groupedTasks);

      })

      .catch(err => {

        console.log("SUBMISSION FETCH ERROR:", err);

      });

  };

  // first load
  fetchSubmissions();

  // auto refresh
  const interval = setInterval(() => {

    fetchSubmissions();

  }, 3000);

  return () => clearInterval(interval);

}, []);

  const renderContent = () => {
    switch (active) {
      case "dashboard":  return <DashboardContent files={files} groups={groups}/>;
      case "groups":     return <GroupManagement groups={groups} setGroups={setGroups}/>;
      case "upload":     return <UploadPage files={files} setFiles={setFiles} setActive={setActive}/>;
      case "sharing":    return <FileSharingPage files={files} groups={groups}/>;
      case "tracking":   return <FileTrackingPage files={files} downloadLogs={downloadLogs}/>;
      case "employees":  return <ManageEmployees/>;
      case "activity":   return <EmployeeActivityPage/>;
      case "logs":       return <DownloadLogsPage downloadLogs={downloadLogs} shareAlerts={shareAlerts}/>;
      case "leak":       return <LeakDetectionPage/>;
      default:           return <DashboardContent files={files} groups={groups}/>;
      case "tasks":      return <TaskManagementPage groups={groups} files={files} tasks={tasks} setTasks={setTasks} taskNotifs={taskNotifs}
  setTaskNotifs={setTaskNotifs}
  setActive={setActive}
/>
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="admin-main">
      <TopBar 
  activePage={active}
  taskNotifCount={taskNotifs.length}
  taskNotifs={taskNotifs}
/>
        <main className="admin-body">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;