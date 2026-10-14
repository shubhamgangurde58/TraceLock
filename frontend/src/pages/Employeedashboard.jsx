// Employee Dashboard Page

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Employeedashboard.css";
import FileViewer from "./Fileview";



/* ICONS */
const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const icons = {
  home:      ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  files:     ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"],
  history:   ["M12 8v4l3 3","M3.05 11A9 9 0 1021 12"],
  user:      ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"],
  bell:      ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  logout:    ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
  menu:      ["M3 12h18","M3 6h18","M3 18h18"],
  close:     ["M18 6L6 18","M6 6l12 12"],
  pdf:       ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6"],
  docx:      ["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M9 15h6","M9 11h6"],
  shield:    ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  lock:      ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
  check:     ["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"],
  search:    ["M21 21l-4.35-4.35","M17 11A6 6 0 105 11a6 6 0 0012 0z"],
  eye:       ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6z"],
  download:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
  edit:      ["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"],
  key:       ["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"],
  info:      ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M11 12h1v4h1"],
  group:     ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
  notif:     ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
  share:     ["M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8","M16 6l-4-4-4 4","M12 2v13"],
  watermark: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z","M9 12l2 2 4-4"],
  filter:    ["M22 3H2l8 9.46V19l4 2V12.46L22 3"],
  badge:     ["M4 3h16a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z","M4 11h16a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3a1 1 0 011-1z"],
  dept:      ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
  tasks:    ["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"],
  calendar: ["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"],
  upload2:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
};

const navItems = [
  { key: "dashboard",    label: "Dashboard",       icon: "home"     },
  { key: "files",        label: "My Shared Files", icon: "files"    },
  { key: "file-status",  label: "File Status",     icon: "history"  },
  { key: "notifications",label: "Notifications",   icon: "notif"    },
  { key: "profile",      label: "Profile",         icon: "user"     },
  { key: "tasks",        label: "My Tasks",        icon: "tasks"    },
];

/* HELPERS */
const fmtSize = (b) =>
  b < 1024 ? b+" B" : b < 1048576 ? (b/1024).toFixed(1)+" KB" : (b/1048576).toFixed(1)+" MB";
const fmtTime = (d) => {
  const diff = Math.floor((new Date()-d)/1000);
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return Math.floor(diff/60)+" min ago";
  if (diff < 86400) return Math.floor(diff/3600)+" hr ago";
  return new Date(d).toLocaleDateString("en-IN");
};

const EmptyState = ({ icon, title, sub, children }) => (
  <div className="emp-empty">
    <div className="emp-empty-icon"><Icon d={icons[icon]} size={28}/></div>
    <div className="emp-empty-title">{title}</div>
    <div className="emp-empty-sub">{sub}</div>
    {children}
  </div>
);

/* SIDEBAR */
const Sidebar = ({ active, setActive, collapsed, setCollapsed, notifCount }) => {
  const navigate = useNavigate();
  return (
    <aside className={`emp-sidebar ${collapsed ? "emp-sidebar-collapsed" : ""}`}>
      <div className="emp-sidebar-logo">
        <div className="emp-logo-icon">
          <svg width="20" height="20" viewBox="0 0 80 80" fill="none">
            <path d="M40 14L20 24V40C20 52 29 62 40 66C51 62 60 52 60 40V24L40 14Z"
              fill="rgba(29,158,117,0.3)" stroke="rgba(93,202,165,0.8)" strokeWidth="2"/>
            <circle cx="40" cy="38" r="7" fill="none" stroke="rgba(150,230,200,0.9)" strokeWidth="1.5"/>
            <circle cx="40" cy="38" r="2.5" fill="rgba(150,230,200,1)"/>
            <line x1="40" y1="40.5" x2="40" y2="46" stroke="rgba(150,230,200,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {!collapsed && <span className="emp-logo-text">TraceLock</span>}
        <button className="emp-sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <Icon d={collapsed ? icons.menu : icons.close} size={16}/>
        </button>
      </div>

      {!collapsed && (
        <div className="emp-role-badge">
          <Icon d={icons.shield} size={12}/>
          <span>Employee Access</span>
        </div>
      )}

      <nav className="emp-sidebar-nav">
        {navItems.map((item) => (
          <button key={item.key}
            className={`emp-sidebar-item ${active === item.key ? "emp-sidebar-item-active" : ""}`}
            onClick={() => setActive(item.key)}>
            <span className="emp-sidebar-icon" style={{position:"relative"}}>
              <Icon d={icons[item.icon]} size={18}/>
              {item.key === "notifications" && notifCount > 0 && (
                <span className="sidebar-notif-dot">{notifCount}</span>
              )}
            </span>
            {!collapsed && <span className="emp-sidebar-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button className="emp-sidebar-logout" onClick={() => navigate("/login")}>
        <span className="emp-sidebar-icon"><Icon d={icons.logout} size={18}/></span>
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

/* TOPBAR */
const TopBar = ({ activePage, notifCount, setActive, userName }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const pageLabel = navItems.find(n => n.key === activePage)?.label || "Dashboard";
  return (
    <header className="emp-topbar">
      <div className="emp-topbar-left">
        <h1 className="emp-topbar-title">{pageLabel}</h1>
        <span className="emp-topbar-date">
          {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </span>
      </div>
      <div className="emp-topbar-right">
        <button className="emp-topbar-icon-btn" onClick={()=>setActive("notifications")} style={{position:"relative"}}>
          <Icon d={icons.bell} size={18}/>
          {notifCount > 0 && <span className="topbar-notif-badge">{notifCount}</span>}
        </button>
        <div className="emp-profile-wrap">
          <button className="emp-topbar-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="emp-avatar">
      {userName ? userName.slice(0,2).toUpperCase() : "U"}
      </div>
            <div className="emp-profile-info">
              <div className="emp-profile-name">{userName}</div>
              <span className="emp-profile-role">Employee</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          {showProfile && (
            <div className="emp-dropdown">
              <div className="emp-dropdown-header">
                <div className="emp-avatar" style={{width:40,height:40,fontSize:14}}>NK</div>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>Nikhil</div>
                  <div style={{fontSize:12,color:"var(--emp-muted)"}}>EMP-1042 · Engineering</div>
                </div>
              </div>
              <div className="emp-dropdown-divider"/>
              <button className="emp-dropdown-item"><Icon d={icons.user} size={14}/> My Profile</button>
              <button className="emp-dropdown-item emp-logout-item" onClick={() => navigate("/login")}>
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
const DashboardPage = ({ setActive, sharedFiles, notifications, userName }) => (
  <div className="emp-dashboard-content">
    {/* Welcome banner */}
    <div className="emp-welcome-banner">
      <div className="emp-welcome-left">
        <div className="emp-avatar">
  {userName ? userName.slice(0,2).toUpperCase() : "U"}
</div>
        <div>
          <h2 className="emp-welcome-name">Welcome back, {userName} 👋</h2>
          <p className="emp-welcome-sub">Secure documents assigned to you.</p>
        </div>
      </div>
      <div className="emp-welcome-shield"><Icon d={icons.shield} size={48}/></div>
    </div>

    {/* Stats */}
    <div className="emp-stats-grid">
      {[
        { label:"Files Shared",    value:sharedFiles.length, sub:`${sharedFiles.length} available`, icon:"files",   color:"teal"   },
        { label:"Notifications",   value:notifications.filter(n=>!n.read).length, sub:"Unread",   icon:"notif",   color:"blue"   },
        { label:"Total Downloads", value:"—",                sub:"Connect backend",                icon:"download",color:"purple" },
        { label:"Total Views",     value:"—",                sub:"Connect backend",                icon:"eye",     color:"green"  },
      ].map(s => (
        <div className={`emp-stat-card emp-stat-${s.color}`} key={s.label}>
          <div className="emp-stat-top">
            <div className="emp-stat-label">{s.label}</div>
            <div className={`emp-stat-icon emp-icon-${s.color}`}><Icon d={icons[s.icon]} size={17}/></div>
          </div>
          <div className="emp-stat-value">{s.value}</div>
          <div className="emp-stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>

    {/* 2-col */}
    <div className="emp-dash-grid2">
      {/* Recent shared files */}
      <div className="emp-card">
        <div className="emp-card-header">
          <h3 className="emp-card-title">Recently Shared Files</h3>
          <button className="emp-card-link" onClick={() => setActive("files")}>View all →</button>
        </div>
        {sharedFiles.length === 0
          ? <EmptyState icon="files" title="No files shared yet" sub="Admin will share files with your group. They will appear here.">
              <button className="emp-go-btn" onClick={()=>setActive("files")}><Icon d={icons.files} size={14}/> Go to My Files</button>
            </EmptyState>
          : <div className="activity-list">
              {[...sharedFiles].reverse().slice(0,5).map(f => (
                <div className="activity-item" key={f.id}>
                  <div className="emp-file-avatar-icon">
                    <Icon d={f.type==="application/pdf"?icons.pdf:icons.docx} size={16}/>
                  </div>
                  <div className="activity-info">
                    <div className="activity-main"><span className="activity-file">{f.name}</span></div>
                    <div className="activity-name">Shared by Admin · {f.group} · {fmtTime(f.sharedAt)}</div>
                  </div>
                  <span className="emp-new-badge">New</span>
                </div>
              ))}
            </div>
        }
      </div>

      {/* Recent notifications */}
      <div className="emp-card">
        <div className="emp-card-header">
          <h3 className="emp-card-title">Notifications</h3>
          <button className="emp-card-link" onClick={() => setActive("notifications")}>View all →</button>
        </div>
        {notifications.length === 0
          ? <EmptyState icon="bell" title="No notifications" sub="New file shares and admin messages will appear here."/>
          : <div className="activity-list">
              {notifications.slice(0,5).map(n => (
                <div className="activity-item" key={n.id} style={{opacity:n.read?0.55:1}}>
                  <div className={`emp-notif-dot-wrap ${n.read?"":"emp-notif-unread"}`}>
                    <Icon d={n.type==="file"?icons.files:icons.info} size={14}/>
                  </div>
                  <div className="activity-info">
                    <div className="activity-main" style={{fontSize:13}}>{n.message}</div>
                    <div className="activity-name">{fmtTime(n.at)}</div>
                  </div>
                  {!n.read && <div className="emp-unread-dot"/>}
                </div>
              ))}
            </div>
        }
      </div>
    </div>

    {/* Security notice */}
    <div className="emp-security-notice">
      <div className="emp-notice-icon"><Icon d={icons.lock} size={18}/></div>
      <div>
        <div className="emp-notice-title">Security Notice</div>
        <div className="emp-notice-text">All file downloads are monitored and watermarked with your identity. Sharing files outside this platform is strictly prohibited and will be detected automatically.</div>
      </div>
    </div>
  </div>
);

/*  MY SHARED FILES */
const FileDownloadRow = ({ file, onDownload, onViewed }) => {
  const [state, setState] = useState("idle");
  const [progress, setProgress] = useState(0);

  //  TYPE FIX 
  const type = file.file_name?.endsWith(".pdf")
    ? "application/pdf"
    : "application/docx";

  //  DOWNLOAD FUNCTION -- in project
  const startDownload = () => {
    setState("downloading");
    setProgress(0);

    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(iv);
          setState("done");

          onDownload && onDownload(file);
          return 100;
        }
        return p + 8;
      });
    }, 90);
  };
  return (
    <div className={`emp-file-row ${state==="done"?"emp-file-row-done":""}`}>
      <div className={`emp-file-row-icon ${file.type==="application/pdf"?"emp-ficon-pdf":"emp-ficon-docx"}`}>
        <Icon d={file.type==="application/pdf"?icons.pdf:icons.docx} size={20}/>
      </div>
      <div className="emp-file-row-info">
        <div className="emp-file-row-name">{file.file_name}</div> 
        <div className="emp-file-row-meta">
          <span className={`emp-type-badge ${file.type==="application/pdf"?"emp-badge-pdf":"emp-badge-docx"}`}>
            {file.type==="application/pdf"?"PDF":"DOCX"}
          </span>
          <span className="emp-dot">·</span>
          <span>{fmtSize(file.size)}</span>
          <span className="emp-dot">·</span>
          <span>Group: {file.group}</span>
          <span className="emp-dot">·</span>
          <span>{fmtTime(file.sharedAt)}</span>
        </div>
        {state==="downloading" && (
          <div className="emp-file-progress-wrap">
            <div className="emp-file-progress-bar"><div className="emp-file-progress-fill" style={{width:progress+"%"}}/></div>
            <span className="emp-file-progress-pct">{progress}%</span>
          </div>
        )}
        {state==="done" && <div className="emp-file-done-msg"><Icon d={icons.check} size={13}/> Downloaded with watermark.</div>}
      </div>

      <div className="emp-file-row-actions">
        {state==="idle" && (
          <>
            <button className="emp-btn-preview" onClick={() => { onViewed&&onViewed(file); }}>
              <Icon d={icons.eye} size={14}/> View
            </button>
            <button className="emp-btn-confirm-dl" onClick={() => setState("confirm")}>
              <Icon d={icons.download} size={14}/> Download
            </button>
          </>
        )}
        {state==="confirm" && (
          <div className="emp-confirm-wrap">
            <div className="emp-confirm-msg"><Icon d={icons.watermark} size={13}/> Will be watermarked with your ID.</div>
            <div className="emp-confirm-btns">
              <button className="emp-btn-proceed" onClick={startDownload}><Icon d={icons.download} size={13}/> Proceed</button>
              <button className="emp-btn-cancel-sm" onClick={() => setState("idle")}>Cancel</button>
            </div>
          </div>
        )}
        {state==="downloading" && <div className="emp-dl-spinner"><div className="emp-spinner"/></div>}
        {state==="done" && <span className="emp-done-badge"><Icon d={icons.check} size={12}/> Done</span>}
      </div>
    </div>
  );
};

const MyFilesPage = ({ sharedFiles, downloadHistory, setDownloadHistory, viewHistory, setViewHistory,  onDownload  }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = sharedFiles.filter(f => {
  const ms =
    (f.file_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.group || "").toLowerCase().includes(search.toLowerCase());

  const mf = filter === "all" || filter === f.type?.split("/").pop();
  return ms && mf;
});


  const handleViewed = (file) => {
    setViewHistory(prev => [{
      id:Date.now(), name:file.name, type:file.type, group:file.group, viewedAt:new Date(),
    }, ...prev]);
  };

  return (
    <div className="emp-files-page">
      {/* Watermark notice */}
      <div className="emp-wm-strip">
        <Icon d={icons.watermark} size={14}/>
        <span>Every download is watermarked with your <strong>Employee ID + timestamp</strong> for security traceability.</span>
      </div>

      {/* Toolbar */}
      <div className="emp-files-toolbar">
        <div className="emp-search-wrap">
          <Icon d={icons.search} size={14}/>
          <input className="emp-search" placeholder="Search files or groups…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className="emp-filter-group">
          {["all","pdf","docx"].map(f=>(
            <button key={f} className={`emp-filter-btn ${filter===f?"emp-filter-active":""}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All Files":f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="emp-file-count">{sharedFiles.length} file{sharedFiles.length!==1?"s":""} shared</div>
      </div>

      {/* File list */}
      {sharedFiles.length === 0 ? (
        <div className="emp-files-empty-wrap">
          <EmptyState icon="lock" title="No files shared yet"
            sub="Admin will share files with your group. They will appear here once shared.">
            <div className="emp-notice-inline"><Icon d={icons.info} size={14}/>Files appear here once admin shares them with your group.</div>
          </EmptyState>
          <div className="emp-how-dl">
            <div className="emp-how-dl-title">How Secure Download Works</div>
            <div className="emp-how-dl-steps">
              {[
                {icon:"files",     title:"Files shared",     desc:"Admin shares files with your group"},
                {icon:"eye",       title:"Preview first",    desc:"View the file before downloading"},
                {icon:"watermark", title:"Watermark applied",desc:"Your ID + timestamp embedded invisibly"},
                {icon:"download",  title:"Secure download",  desc:"File delivered securely to your device"},
              ].map((s,i)=>(
                <div className="emp-how-step" key={i}>
                  <div className="emp-how-step-num">{i+1}</div>
                  <div className="emp-how-step-icon"><Icon d={icons[s.icon]} size={16}/></div>
                  <div className="emp-how-step-title">{s.title}</div>
                  <div className="emp-how-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="search" title="No results" sub="Try a different search or filter."/>
      ) : (
        <div className="emp-file-list">
          {filtered.map(f => (
            <FileDownloadRow 
              key={f.id} 
              file={f} 
               onDownload={onDownload}   
               onViewed={handleViewed}
/>
          ))}
        </div>
      )}
    </div>
  );
};

/* FILE STATUS */
const FileStatusPage = ({ downloadHistory, viewHistory }) => {
  const [tab, setTab] = useState("downloads");

  const current = tab === "downloads" ? downloadHistory : viewHistory;

  return (
    <div className="emp-history-page">
      <div className="emp-stats-grid" style={{marginBottom:4}}>
        {[
          {label:"Files Viewed",    value:viewHistory.length,    sub:"Total",      icon:"eye",     color:"teal"  },
          {label:"Files Downloaded",value:downloadHistory.length, sub:"Total",     icon:"download",color:"blue"  },
        ].map(s=>(
          <div className={`emp-stat-card emp-stat-${s.color}`} key={s.label}>
            <div className="emp-stat-top">
              <div className="emp-stat-label">{s.label}</div>
              <div className={`emp-stat-icon emp-icon-${s.color}`}><Icon d={icons[s.icon]} size={17}/></div>
            </div>
            <div className="emp-stat-value">{s.value}</div>
            <div className="emp-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="emp-history-toolbar">
        <div className="emp-tab-group">
          <button className={`emp-tab ${tab==="downloads"?"emp-tab-active":""}`} onClick={()=>setTab("downloads")}>
            <Icon d={icons.download} size={14}/> Downloads ({downloadHistory.length})
          </button>
          <button className={`emp-tab ${tab==="views"?"emp-tab-active":""}`} onClick={()=>setTab("views")}>
            <Icon d={icons.eye} size={14}/> Views ({viewHistory.length})
          </button>
        </div>
      </div>

      {current.length === 0
        ? <EmptyState icon={tab==="downloads"?"download":"eye"}
            title={tab==="downloads"?"No downloads yet":"No views yet"}
            sub={tab==="downloads"
              ? "Files you download will be logged here with watermark ID."
              : "Files you view will be logged here."}/>
        : <div className="emp-history-table-wrap">
            <table className="emp-history-table">
              <thead>
                <tr>
                  <th>File Name</th><th>Type</th><th>Group</th>
                  <th>{tab==="downloads"?"Downloaded At":"Viewed At"}</th>
                  {tab==="downloads" && <th>Watermark ID</th>}
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {current.map(h => (
                  <tr key={h.id}>
                    <td>
                      <div className="emp-ht-file-cell">
                        <div className={`emp-ht-icon ${h.type==="application/pdf"?"emp-ficon-pdf":"emp-ficon-docx"}`} style={{width:28,height:28,borderRadius:7}}>
                          <Icon d={h.type==="application/pdf"?icons.pdf:icons.docx} size={13}/>
                        </div>
                        <span className="emp-ht-name">{h.name}</span>
                      </div>
                    </td>
                    <td><span className={`emp-type-badge ${h.type==="application/pdf"?"emp-badge-pdf":"emp-badge-docx"}`}>{h.type==="application/pdf"?"PDF":"DOCX"}</span></td>
                    <td className="emp-ht-meta">{h.group||"—"}</td>
                    <td className="emp-ht-meta">{(h.downloadedAt||h.viewedAt)?.toLocaleString("en-IN")||"—"}</td>
                    {tab==="downloads" && <td className="emp-ht-meta emp-mono">{h.watermarkId||"—"}</td>}
                    <td><span className="emp-status-ok"><Icon d={icons.check} size={11}/> {tab==="downloads"?"Downloaded":"Viewed"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  );
};

/* NOTIFICATIONS */
const NotificationsPage = ({ notifications, setNotifications }) => {
  const unread = notifications.filter(n=>!n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({...n, read:true})));

  const markRead = (id) =>
    setNotifications(prev => prev.map(n => n.id===id ? {...n, read:true} : n));

  return (
    <div className="emp-notif-page">
      <div className="emp-notif-toolbar">
        <div>
          <div className="emp-notif-count">{notifications.length} notification{notifications.length!==1?"s":""}</div>
          {unread > 0 && <div className="emp-notif-unread-count">{unread} unread</div>}
        </div>
        {unread > 0 && (
          <button className="emp-mark-all-btn" onClick={markAllRead}>Mark all as read</button>
        )}
      </div>

      {notifications.length === 0
        ? <EmptyState icon="bell" title="No notifications" sub="New file shares, admin messages, and alerts will appear here."/>
        : <div className="emp-notif-list">
            {notifications.map(n => (
              <div key={n.id}
                className={`emp-notif-item ${!n.read?"emp-notif-item-unread":""}`}
                onClick={() => markRead(n.id)}>
                <div className={`emp-notif-icon-wrap emp-notif-${n.type}`}>
                  <Icon d={n.type==="file"?icons.files:n.type==="alert"?icons.shield:icons.info} size={16}/>
                </div>
                <div className="emp-notif-content">
                  <div className="emp-notif-msg">{n.message}</div>
                  {n.detail && <div className="emp-notif-detail">{n.detail}</div>}
                  <div className="emp-notif-time">{fmtTime(n.at)}</div>
                </div>
                {!n.read && <div className="emp-unread-dot"/>}
              </div>
            ))}
          </div>
      }
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════
// EMPLOYEE — COMPLETE TASK FLOW
//
// HOW TO ADD IN EmployeeDashboard.jsx:
//
// 1. icons object mein add karo:
//   tasks:    ["M9 11l3 3L22 4","M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"],
//   calendar: ["M3 4h18v18H3z","M16 2v4","M8 2v4","M3 10h18"],
//   upload2:  ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"],
//   thumbUp:  ["M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z","M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"],
//
// 2. navItems mein add karo (profile ke pehle):
//   { key:"tasks", label:"My Tasks", icon:"tasks" },
//
// 3. MAIN EmployeeDashboard mein tasks state add karo:
//   const [empTasks, setEmpTasks] = useState([]);
//   // Backend fetch:
//   // useEffect(() => {
//   //   fetch(`http://localhost:5000/api/employee/tasks/${userEmail}`)
//   //     .then(r=>r.json()).then(setEmpTasks).catch(console.error);
//   // }, [userEmail]);
//
// 4. renderContent() mein add karo:
//   case "tasks": return <MyTasksPage tasks={empTasks} setTasks={setEmpTasks} userName={userName} userEmail={userEmail}/>;
//
// ══════════════════════════════════════════════════════════════════

/* ══ MY TASKS PAGE (Employee) — Full Submit Flow ════════════════════ */
const MyTasksPage = ({
  tasks,
  setTasks,
  userName,
  userEmail,
  getSubmission
}) => {

  /* submittingTask = task jiska submit form open hai */
  const [submittingTask, setSubmittingTask] = useState(null);
  const [viewingTask,    setViewingTask]    = useState(null); // status view
 
  

  // Submit form state
  const [submitDescription, setSubmitDescription] = useState("");
  const [submitFile,        setSubmitFile]         = useState(null);
  const [submitLoading,     setSubmitLoading]      = useState(false);
  const [submitError,       setSubmitError]        = useState("");

  const submitFileRef = React.createRef();

  const priorityColor = { low:"#5dcaa5", medium:"#ef9f27", high:"#e24b4a" };
  const priorityBg    = { low:"rgba(29,158,117,0.12)", medium:"rgba(239,159,39,0.12)", high:"rgba(226,75,74,0.12)" };

  /* Deadline display */
  const deadlineInfo = (dl) => {
    const diff = new Date(dl) - new Date();
    if (diff < 0)            return { label:"Overdue",      color:"#e24b4a", bg:"rgba(226,75,74,0.1)"   };
    if (diff < 86400000)     return { label:"Due today",    color:"#ef9f27", bg:"rgba(239,159,39,0.1)"  };
    if (diff < 2*86400000)   return { label:"Due tomorrow", color:"#ef9f27", bg:"rgba(239,159,39,0.1)"  };
    return { label:`${Math.floor(diff/86400000)} days left`, color:"#5dcaa5", bg:"rgba(29,158,117,0.08)" };
  };

  /* Download reference file */
  const handleDownloadRef = (task) => {
    if (!task.file) return;
    // window.open(`http://localhost:5000/api/employee/download/${task.file.name}?email=${userEmail}`);
    alert(`Downloading: ${task.file.name}\n(Connect backend to enable real download)`);
  };

  /* Open submit form */
  const openSubmit = (task) => {
    setSubmittingTask(task);
    setSubmitDescription(""); setSubmitFile(null); setSubmitError("");
  };

  /* Submit task */
  const handleSubmit = () => {
    if (!submitDescription.trim()) { setSubmitError("Description is required."); return; }
    setSubmitLoading(true);

    setTimeout(() => {
      const sub = {
        id:          Date.now(),
        empName:     userName || "Employee",
        empId:       userEmail || "—",
        description: submitDescription.trim(),
        fileName:    submitFile?.name || null,
        fileUrl:     submitFile ? URL.createObjectURL(submitFile) : null,
        submittedAt: new Date(),
        status:      "pending",   // pending | approved | rejected
        rejectNote:  null,
        reviewedAt:  null,
      };

      setTasks(prev => prev.map(t =>
        t.id === submittingTask.id
  ? { ...t, submissions: [...(t.submissions||[]), sub] }
          : t
      ));

      /* 🔥 SEND NOTIFICATION TO ADMIN */
      console.log("TASK ID SENDING:", submittingTask.id);
fetch("http://localhost:5000/api/users/employee/submit-task", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  taskId: submittingTask.id,
  employeeEmail: userEmail,
  employeeName: userName,
  description: submitDescription,
  fileName: submitFile?.name || "",
  taskTitle: submittingTask.title
})
})
.then(res => res.json())
.then(data => {
  console.log("SUBMIT RESPONSE:", data);
})
.catch(err => console.log("ERROR:", err));

      /* Backend:
      const fd = new FormData();
      fd.append("taskId", submittingTask.id);
      fd.append("email", userEmail);
      fd.append("description", submitDescription);
      if (submitFile) fd.append("file", submitFile);
      fetch("http://localhost:5000/api/employee/tasks/submit", { method:"POST", body:fd }); */

      setSubmitLoading(false);
      setSubmittingTask(null);
    }, 1400);
  };

const pending = tasks.filter(
  t => !getSubmission(t.id)
);

const submitted = tasks.filter(
  t => getSubmission(t.id)
);
  return (
    <div className="emp-tasks-page">

      {/* Stats */}
      <div className="emp-tasks-stats">
        <div className="emp-task-stat">
          <div className="emp-task-stat-num">{tasks.length}</div>
          <div className="emp-task-stat-label">Total</div>
        </div>
        <div className="emp-task-stat-sep"/>
        <div className="emp-task-stat">
          <div className="emp-task-stat-num" style={{color:"#ef9f27"}}>{pending.length}</div>
          <div className="emp-task-stat-label">Pending</div>
        </div>
        <div className="emp-task-stat-sep"/>
        <div className="emp-task-stat">
          <div className="emp-task-stat-num" style={{color:"#5dcaa5"}}>
            {
  submitted.filter(
    t => getSubmission(t.id)?.status === "approved"
  ).length
}
          </div>
          <div className="emp-task-stat-label">Approved</div>
        </div>
        <div className="emp-task-stat-sep"/>
        <div className="emp-task-stat">
          <div className="emp-task-stat-num" style={{color:"#e24b4a"}}>
            {
  submitted.filter(
    t => getSubmission(t.id)?.status === "rejected"
  ).length
}
          </div>
          <div className="emp-task-stat-label">Rejected</div>
        </div>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <EmptyState icon="tasks" title="No tasks assigned"
          sub="Admin will assign tasks here. You will be notified when a new task arrives."/>
      ) : (
        <div className="emp-task-list">
          {tasks.map(task => {
            const submission = getSubmission(task.id);
            const dl  = deadlineInfo(task.deadline);
            const sub = getSubmission(task.id);
            console.log("TASK:", task.id, sub);
            return (
              <div key={task.id}
                className={`emp-task-card ${sub?.status==="approved"?"emp-task-card-approved":""} ${sub?.status==="rejected"?"emp-task-card-rejected":""}`}>

                {/* Top row */}
                <div className="emp-task-card-top">
                  <div className="emp-task-card-left">
                    <div className="emp-task-priority-dot" style={{background:priorityColor[task.priority]}}/>
                    <div className="emp-task-title">{task.title}</div>
                    <span className="emp-task-priority-badge"
                      style={{background:priorityBg[task.priority],color:priorityColor[task.priority],border:`1px solid ${priorityColor[task.priority]}40`}}>
                      {task.priority}
                    </span>
                  </div>

                  {/* Status badge */}
                  {sub?.status === "approved" && (
  <span className="emp-task-status-chip emp-task-status-approved">
    ✓ Approved
  </span>
)}

{sub?.status === "rejected" && (
  <span className="emp-task-status-chip emp-task-status-rejected">
    ✗ Rejected
  </span>
)}

{sub?.status === "pending" && (
  <span className="emp-task-status-chip emp-task-status-pending">
    ⏳ Under Review
  </span>
)}
                </div>

                {/* Description */}
                {task.description && (
                  <div className="emp-task-desc">{task.description}</div>
                )}

                {/* Meta */}
                <div className="emp-task-meta">
                  <div className="emp-task-meta-item"><Icon d={icons.group} size={12}/><span>{task.assignLabel}</span></div>
                  <div className="emp-task-meta-item"><Icon d={icons.calendar} size={12}/>
                    <span>Due: {new Date(task.deadline).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  {task.file && <div className="emp-task-meta-item"><Icon d={icons.files} size={12}/><span>{task.file.name}</span></div>}
                </div>

                {/* Rejection feedback */}
                {sub?.status === "rejected" && sub?.rejectNote && (
                  <div className="emp-task-reject-feedback">
                    <Icon d={icons.info} size={13}/>
                    <div>
                      <div className="emp-task-reject-feedback-label">Admin Feedback:</div>
                      <div className="emp-task-reject-feedback-note">{sub.rejectNote}</div>
                    </div>
                  </div>
                )}

                {/* Submitted info */}
                {sub && (
                  <div className="emp-task-submitted-strip">
                    <Icon d={icons.check} size={13}/>
                    <span>Submitted {new Date(sub.submittedAt).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                    {sub.fileName && <span className="emp-task-sub-file">· {sub.fileName}</span>}
                  </div>
                )}

                {/* Action buttons */}
                <div className="emp-task-actions">
                  {/* Download reference file */}
                  {task.file && (
                    <button className="emp-task-btn emp-task-btn-download"
                      onClick={() => handleDownloadRef(task)}>
                      <Icon d={icons.download} size={14}/> Download File
                      <span className="emp-task-file-name">{task.file.name}</span>
                    </button>
                  )}

                  {/* Submit button — show if not submitted OR rejected (can resubmit) */}
                  {(!sub || sub.status === "rejected") && (
                    <button className="emp-task-btn emp-task-btn-submit"
                      onClick={() => openSubmit(task)}>
                      <Icon d={icons.upload2} size={14}/>
                      {sub?.status === "rejected" ? "Resubmit Task" : "Submit Task"}
                    </button>
                  )}

                  {/* View status */}
                  <button className="emp-task-btn emp-task-btn-view"
                    onClick={() => setViewingTask(task)}>
                    <Icon d={icons.eye} size={14}/> View Status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══ SUBMIT TASK PAGE (full screen modal) ══ */}
      {submittingTask && (
        <div className="emp-task-modal-overlay"
          onClick={e => e.target === e.currentTarget && setSubmittingTask(null)}>
          <div className="emp-submit-page">

            {/* Header */}
            <div className="emp-submit-header">
              <div className="emp-submit-header-left">
                <button className="emp-submit-back" onClick={() => setSubmittingTask(null)}>
                  <Icon d={icons.close} size={15}/>
                </button>
                <div>
                  <div className="emp-submit-header-title">Submit Task</div>
                  <div className="emp-submit-header-sub">{submittingTask.title}</div>
                </div>
              </div>
              <div className="emp-submit-header-meta">
                <Icon d={icons.calendar} size={13}/>
                Due: {new Date(submittingTask.deadline).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>

            <div className="emp-submit-body">

              {/* Task details recap */}
              <div className="emp-submit-task-recap">
                <div className="emp-submit-recap-label">Task Description</div>
                <div className="emp-submit-recap-text">
                  {submittingTask.description || "No description provided."}
                </div>
                {submittingTask.file && (
                  <button className="emp-task-btn emp-task-btn-download" style={{marginTop:12}}
                    onClick={() => handleDownloadRef(submittingTask)}>
                    <Icon d={icons.download} size={13}/> Download Reference File: {submittingTask.file.name}
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="emp-submit-divider">
                <span>Your Submission</span>
              </div>

              {/* Description (required) */}
              <div className="emp-submit-field">
                <label className="emp-submit-field-label">
                  Description <span style={{color:"#e24b4a"}}>*</span>
                </label>
                <div className="emp-submit-field-hint">
                  Describe what you've done, any findings, or notes for the admin.
                </div>
                <textarea className="emp-submit-textarea" rows={6}
                  placeholder="Write a clear description of your work and what you're submitting…"
                  value={submitDescription}
                  onChange={e => { setSubmitDescription(e.target.value); setSubmitError(""); }}/>
                <div className="emp-submit-char-count">
                  {submitDescription.length} characters
                  {submitDescription.length < 20 && submitDescription.length > 0 &&
                    <span style={{color:"#ef9f27"}}> — add more detail</span>}
                </div>
              </div>

              {/* File attachment (optional) */}
              <div className="emp-submit-field">
                <label className="emp-submit-field-label">Attach File (optional)</label>
                <div className="emp-submit-field-hint">
                  PDF, DOCX, Excel, or any relevant document.
                </div>
                <div className={`emp-submit-file-zone ${submitFile?"emp-submit-file-zone-filled":""}`}
                  onClick={() => submitFileRef.current?.click()}>
                  <input type="file" ref={submitFileRef} style={{display:"none"}}
                    accept=".pdf,.docx,.doc,.txt,.xlsx,.csv,.png,.jpg"
                    onChange={e => { setSubmitFile(e.target.files[0] || null); }}/>
                  {submitFile ? (
                    <>
                      <div className="emp-submit-file-icon"><Icon d={icons.check} size={20}/></div>
                      <div className="emp-submit-file-name">{submitFile.name}</div>
                      <div className="emp-submit-file-size">{(submitFile.size/1024).toFixed(1)} KB</div>
                      <button className="emp-submit-file-remove"
                        onClick={e => { e.stopPropagation(); setSubmitFile(null); }}>
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="emp-submit-file-icon"><Icon d={icons.upload2} size={24}/></div>
                      <div className="emp-submit-file-text">Click to attach a file</div>
                      <div className="emp-submit-file-sub">PDF, DOCX, Excel, images supported</div>
                    </>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="task-form-error">
                  <Icon d={icons.alert} size={13}/> {submitError}
                </div>
              )}

              {/* Submit actions */}
              <div className="emp-submit-actions">
                <button className="emp-submit-btn" onClick={handleSubmit} disabled={submitLoading}>
                  {submitLoading
                    ? <><span className="emp-spinner" style={{width:16,height:16,borderColor:"rgba(255,255,255,0.3)",borderTopColor:"#fff"}}/> Submitting…</>
                    : <><Icon d={icons.check} size={16}/> Submit Task</>
                  }
                </button>
                <button className="btn-cancel" onClick={() => setSubmittingTask(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* ══ VIEW STATUS MODAL ══ */}
{viewingTask && (

  <div
    className="emp-task-modal-overlay"
    onClick={(e) =>
      e.target === e.currentTarget &&
      setViewingTask(null)
    }
  >

    <div className="emp-task-modal">

      {(() => {

        const currentSubmission =
          getSubmission(viewingTask.id);

        return (

          <>
          
            {/* HEADER */}
            <div className="emp-task-modal-header">

              <div className="emp-task-modal-title">
                Task Status
              </div>

              <button
                className="fv-close-btn"
                onClick={() => setViewingTask(null)}
              >
                <Icon d={icons.close} size={16}/>
              </button>

            </div>

            {/* BODY */}
            <div className="emp-task-modal-body">

              {/* TASK INFO */}
              <div style={{ marginBottom:16 }}>

                <div
                  style={{
                    fontWeight:700,
                    fontSize:15,
                    color:"#e6edf3",
                    marginBottom:4
                  }}
                >
                  {viewingTask.title}
                </div>

                {viewingTask.description && (

                  <div
                    style={{
                      fontSize:13,
                      color:"rgba(230,237,243,0.5)",
                      lineHeight:1.6
                    }}
                  >
                    {viewingTask.description}
                  </div>

                )}

              </div>

              {/* TIMELINE */}
              <div className="emp-status-timeline">

                {/* STEP 1 */}
                <div className="emp-status-step emp-status-step-done">

                  <div className="emp-status-dot emp-status-dot-done">
                    <Icon d={icons.check} size={11}/>
                  </div>

                  <div className="emp-status-line"/>

                  <div className="emp-status-info">

                    <div className="emp-status-label">
                      Task Assigned
                    </div>

                    <div className="emp-status-time">

                      {new Date(viewingTask.createdAt)
                        .toLocaleString("en-IN")}

                    </div>

                  </div>

                </div>

                {/* STEP 2 */}
                <div className={`emp-status-step ${
                  currentSubmission
                    ? "emp-status-step-done"
                    : "emp-status-step-pending"
                }`}>

                  <div className={`emp-status-dot ${
                    currentSubmission
                      ? "emp-status-dot-done"
                      : "emp-status-dot-pending"
                  }`}>

                    {currentSubmission
                      ? <Icon d={icons.check} size={11}/>
                      : "2"
                    }

                  </div>

                  <div className="emp-status-line"/>

                  <div className="emp-status-info">

                    <div className="emp-status-label">
                      Task Submitted
                    </div>

                    {currentSubmission ? (

                      <div className="emp-status-time">
                        Submitted Successfully
                      </div>

                    ) : (

                      <div
                        className="emp-status-time"
                        style={{ color:"rgba(230,237,243,0.3)" }}
                      >
                        Not submitted yet
                      </div>

                    )}

                  </div>

                </div>

                {/* STEP 3 */}
                <div className={`emp-status-step ${
                  currentSubmission?.status === "approved"
                    ? "emp-status-step-done"
                    : currentSubmission?.status === "rejected"
                    ? "emp-status-step-done"
                    : currentSubmission
                    ? "emp-status-step-inprogress"
                    : "emp-status-step-pending"
                }`}>

                  <div className={`emp-status-dot ${
                    currentSubmission?.status === "approved"
                      ? "emp-status-dot-approved"
                      : currentSubmission?.status === "rejected"
                      ? "emp-status-dot-rejected"
                      : currentSubmission
                      ? "emp-status-dot-inprogress"
                      : "emp-status-dot-pending"
                  }`}>

                    {currentSubmission?.status === "approved"
                      ? <Icon d={icons.check} size={11}/>
                      : currentSubmission?.status === "rejected"
                      ? "✗"
                      : "3"
                    }

                  </div>

                  <div className="emp-status-line"/>

                  <div className="emp-status-info">

                    <div className="emp-status-label">
                      Admin Review
                    </div>

                    {currentSubmission?.status === "pending" && (
                      <div
                        className="emp-status-time"
                        style={{ color:"#ef9f27" }}
                      >
                        Under Review...
                      </div>
                    )}

                    {currentSubmission?.status === "approved" && (
                      <div
                        className="emp-status-time"
                        style={{ color:"#5dcaa5" }}
                      >
                        Approved ✓
                      </div>
                    )}

                    {currentSubmission?.status === "rejected" && (
                      <div
                        className="emp-status-time"
                        style={{ color:"#e24b4a" }}
                      >
                        Rejected ✗
                      </div>
                    )}

                  </div>

                </div>

                {/* STEP 4 */}
                <div className={`emp-status-step ${
                  currentSubmission?.status === "approved"
                    ? "emp-status-step-done"
                    : "emp-status-step-pending"
                }`}>

                  <div className={`emp-status-dot ${
                    currentSubmission?.status === "approved"
                      ? "emp-status-dot-approved"
                      : "emp-status-dot-pending"
                  }`}>
                    {currentSubmission?.status === "approved"
                      ? <Icon d={icons.check} size={11}/>
                      : "4"
                    }

                  </div>

                  <div className="emp-status-info">

                    <div className="emp-status-label">
                      Task Complete
                    </div>

                    {currentSubmission?.status === "approved" ? (

                      <div
                        className="emp-status-time"
                        style={{ color:"#5dcaa5" }}
                      >
                        Completed ✓
                      </div>

                                        ) : (

                                           <div
                        className="emp-status-time"
                        style={{ color:"rgba(230,237,243,0.25)" }}
                      >
                        Pending
                      </div>

                    )}

                  </div>

                </div>

              </div>

            </div>

          </>

        );

      })()}

    </div>

  </div>

)}
      
    </div>
  );
};
// PROFILE
const ProfilePage = () => {

  const [editMode,  setEditMode]  = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [passForm,  setPassForm]  = useState({current:"",newPass:"",confirm:""});
  const [passError, setPassError] = useState("");
  const [passDone,  setPassDone]  = useState(false);

  const handlePassSubmit = (e) => {
    e.preventDefault(); setPassError("");
    if (!passForm.current)                     { setPassError("Current password required.");    return; }
    if (passForm.newPass.length < 8)           { setPassError("Min 8 characters required.");   return; }
    if (passForm.newPass !== passForm.confirm) { setPassError("Passwords do not match.");       return; }
    setPassDone(true); setPassForm({current:"",newPass:"",confirm:""});
    setTimeout(() => setPassDone(false), 3000);
  };

  const fields = [
    {icon:"user",    label:"Full Name",     value:"Nikhil",             editable:true  },
    {icon:"badge",   label:"Employee ID",   value:"EMP-1042",           editable:false },
    {icon:"bell",    label:"Email",         value:"nikhil@company.com", editable:true  },
    {icon:"dept",    label:"Department",    value:"Engineering",        editable:false },
    {icon:"check",   label:"Status",        value:"Active",             editable:false },
  ];

  return (
    <div className="emp-profile-page">
      <div className="emp-profile-card">
        <div className="emp-profile-card-header">
          <div className="emp-profile-big-avatar">NK</div>
          <div>
            <h2 className="emp-profile-name-big">Nikhil</h2>
            <div className="emp-profile-role-tag"><Icon d={icons.shield} size={12}/> Employee · EMP-1042</div>
            <div className="emp-profile-dept">Engineering Department</div>
          </div>
          <button className="emp-edit-btn" onClick={() => setEditMode(!editMode)}>
            <Icon d={icons.edit} size={14}/> {editMode?"Cancel":"Edit Profile"}
          </button>
        </div>
        <div className="emp-profile-fields">
          {fields.map(f => (
            <div className="emp-profile-field" key={f.label}>
              <div className="emp-pf-icon"><Icon d={icons[f.icon]} size={14}/></div>
              <div className="emp-pf-content">
                <div className="emp-pf-label">{f.label}</div>
                {editMode && f.editable
                  ? <input className="emp-pf-input" defaultValue={f.value}/>
                  : <div className="emp-pf-value">{f.value}</div>
                }
              </div>
              {!f.editable && <span className="emp-pf-locked"><Icon d={icons.lock} size={12}/></span>}
            </div>
          ))}
        </div>
        {editMode && (
          <div className="emp-profile-save-row">
            <button className="emp-btn-save" onClick={() => setEditMode(false)}>
              <Icon d={icons.check} size={14}/> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Change password */}
      <div className="emp-password-card">
        <div className="emp-pw-header">
          <div className="emp-pw-icon"><Icon d={icons.key} size={18}/></div>
          <div><div className="emp-pw-title">Change Password</div><div className="emp-pw-sub">Keep your account secure.</div></div>
        </div>
        <form onSubmit={handlePassSubmit} noValidate>
          {[{id:"cur",label:"Current Password",field:"current"},{id:"new",label:"New Password",field:"newPass"},{id:"con",label:"Confirm Password",field:"confirm"}].map(item=>(
            <div className="emp-pw-group" key={item.id}>
              <label htmlFor={item.id}>{item.label}</label>
              <div className="emp-pw-input-wrap">
                <input id={item.id} type={showPass?"text":"password"} placeholder="••••••••"
                  value={passForm[item.field]} onChange={e=>setPassForm({...passForm,[item.field]:e.target.value})}/>
              </div>
            </div>
          ))}
          <div className="emp-pw-show-row">
            <label className="emp-pw-show-label">
              <input type="checkbox" onChange={e=>setShowPass(e.target.checked)}/> Show passwords
            </label>
          </div>
          {passError && <div className="emp-pw-error"><Icon d={icons.info} size={13}/> {passError}</div>}
          {passDone  && <div className="emp-pw-success"><Icon d={icons.check} size={13}/> Password changed!</div>}
          <button type="submit" className="emp-btn-change-pass">
            <Icon d={icons.key} size={14}/> Update Password
          </button>
        </form>
      </div>
    </div>
  );
};



{/* MAIN  */}
const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);

  

  const [selectedFile, setSelectedFile] = useState(null);

  const handleDownload = (file) => {
  const fileType = file.file_name.endsWith(".pdf")
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  setSelectedFile({
    name: file.file_name,
    type: fileType,  
    size: file.size,
    objectUrl: `http://localhost:5000/api/users/employee/download/${file.file_name}`
  });
};

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");

 

useEffect(() => {
  const email = localStorage.getItem("email");

  fetch(`http://localhost:5000/api/users/employee/tasks/${email}`)
    .then(res => res.json())
    .then(data => {
      console.log("TASKS:", data);
      setTasks(data);
    })
    .catch(err => console.log(err));
}, []);

  

  const [active, setActive] = useState("notifications");
  const [collapsed, setCollapsed] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [viewHistory, setViewHistory] = useState([]);

  const [sharedFiles, setSharedFiles] = useState([]);
  const [notifications, setNotifications] = useState([]);


  // FILES FETCH
  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/api/users/employee/files/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("FILES:", data);
        setSharedFiles(data);
      })
      .catch((err) => console.log("ERROR:", err));
  }, [userEmail]);

  //  NOTIFICATIONS FETCH
  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/api/users/employee/notifications/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("NOTIFICATIONS:", data);

        const formattedData = data.map((item) => ({
          id: item.id,
          message: item.message,
          type: "info",
          read: false,
          at: new Date(item.created_at),
        }));

        setNotifications(formattedData);
      })
      .catch((err) => console.log("ERROR:", err));
  }, [userEmail]);

useEffect(() => {

  if (!userEmail) return;

  const fetchSubmissions = () => {

    fetch(`http://localhost:5000/api/users/employee/submissions/${userEmail}`)

      .then(res => res.json())

      .then(data => {

        console.log("MY SUBMISSIONS:", data);

        setMySubmissions(data);

      })

      .catch(err => console.log(err));

  };

  // FIRST LOAD
  fetchSubmissions();

  // AUTO REFRESH EVERY 3 SEC
  const interval = setInterval(() => {

    fetchSubmissions();

  }, 3000);

  return () => clearInterval(interval);

}, [userEmail]);



const getSubmission = (taskId) => {

  const filtered = mySubmissions.filter(
    s => Number(s.task_id) === Number(taskId)
  );

  if (filtered.length === 0) return null;

  // latest submission return
  return filtered.sort((a, b) => b.id - a.id)[0];
};


const unreadCount = notifications.filter(n => !n.read).length;
  const renderContent = () => {
    switch (active) {
     case "dashboard":      return <DashboardPage setActive={setActive} sharedFiles={sharedFiles} notifications={notifications}/>;
      case "files":         return <MyFilesPage sharedFiles={sharedFiles} downloadHistory={downloadHistory} setDownloadHistory={setDownloadHistory} viewHistory={viewHistory} setViewHistory={setViewHistory} onDownload={handleDownload} />;
      case "file-status":   return <FileStatusPage downloadHistory={downloadHistory} viewHistory={viewHistory}/>;
      case "notifications": return <NotificationsPage notifications={notifications} setNotifications={setNotifications}/>;
      case "profile":       return <ProfilePage/>;
      case "tasks":
        return (
          <MyTasksPage
            tasks={tasks}
            setTasks={setTasks}
            userName={userName}
            userEmail={userEmail}
            getSubmission={getSubmission}
          />
        );
      default:              return <DashboardPage setActive={setActive} sharedFiles={sharedFiles} notifications={notifications}/>;
      //case "tasks": return <MyTasksPage tasks={empTasks} setTasks={setEmpTasks} userName={userName} userEmail={userEmail}/>;
    }
  };

  return (
    <div className="emp-layout">
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} notifCount={unreadCount}/>
      <div className="emp-main">
        <TopBar 
          activePage={active} 
          notifCount={unreadCount} 
         setActive={setActive}
          userName={userName}
/>

        <main className="emp-body">{renderContent()}</main>
      </div>

      {selectedFile && (
       <FileViewer
           file={selectedFile}
           watermarkId={"EMP-101"}
            mode="download"
          onClose={() => setSelectedFile(null)}
  />
)}
    </div>
  );
};

export default EmployeeDashboard;