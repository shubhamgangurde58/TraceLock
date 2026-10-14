const express = require("express");
const router = express.Router();
const multer = require("multer");


const { verifyToken } = require("../middlewares/authmiddleware");

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user
  });
});

const { registerUser, loginUser, sendOtp, verifyOtp, resetPassword, getEmployees, getNotifications,
   addToGroup, getSharedFiles, shareFileToGroup, downloadFile ,createTask, getEmployeeTasks,submitTask, 
   getTaskSubmissions, approveSubmission, rejectSubmission, getEmployeeSubmissions}  
 = require("../controllers/userController");

 // MULTER CONFIG 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");     //  backend/uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);   // original name save 
  }
});

const upload = multer({ storage: storage });

// AUTH ROUTES
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.get("/admin/employees", getEmployees);
router.get("/employee/notifications/:email", getNotifications);
router.post("/admin/add-to-group", addToGroup);
router.get("/employee/files/:email", getSharedFiles);

router.post("/admin/share-file", shareFileToGroup);
router.get("/employee/download/:filename", downloadFile);
router.post("/admin/tasks", createTask);
router.get("/employee/tasks/:email", getEmployeeTasks);
router.post("/employee/submit-task", submitTask);
router.get("/admin/task-submissions", getTaskSubmissions);

router.put("/admin/approve-submission/:id",approveSubmission);

router.put("/admin/reject-submission/:id",rejectSubmission);
router.get("/employee/submissions/:email",getEmployeeSubmissions);
router.put("/reject-submission/:id",rejectSubmission);


//upload routes
router.post("/upload", upload.single("file"), (req, res) => {
  console.log("FILE UPLOADED:", req.file);
  res.json({ message: "File uploaded", file: req.file });
});


// PROFILE
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "User profile",
    user: req.user
  });
});

module.exports = router;