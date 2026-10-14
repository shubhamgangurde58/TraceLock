const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// SIGNUP 
const registerUser = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body); 

    const name = req.body.name;
    const password = req.body.password;
    const role = req.body.role;
    const email = req.body.email?.toLowerCase();

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if user already exists
    const checkUser = "SELECT * FROM users WHERE email = ?";
    db.query(checkUser, [email], async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

      db.query(
        sql,
        [name, email, hashedPassword, role || "employee"],
        (err, result) => {
          if (err) {
            if (err.code === "ER_DUP_ENTRY") {
              return res.status(400).json({ message: "Email already registered" });
            }
            return res.status(500).json(err);
          }

          return res.json({ message: "User registered successfully" });
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN 
const loginUser = (req, res) => {
  try {
    const email = req.body?.email?.toLowerCase();
    const password = req.body?.password;
    const role = req.body?.role?.toLowerCase(); 

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password and role required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];
      

      //  Fixed role check
      if (user.role.toLowerCase() !== role) {
        return res.status(403).json({
          message: "Access denied: You are not allowed to login as this role"
        });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.status(500).json(err);

        if (!isMatch) {
          return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        return res.json({
          message: "Login successful",
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      });
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// Send OTP
const sendOtp = (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email.toLowerCase()], async (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    //  OTP generate
    const otp = Math.floor(100000 + Math.random() * 900000);

    //  DB update
    const updateSql = "UPDATE users SET otp = ?, otp_expire = ? WHERE email = ?";
    db.query(updateSql, [otp, Date.now() + 5 * 60 * 1000, email.toLowerCase()]);

    await sendEmail(email, otp);

    // response
    res.json({ message: "OTP sent to email" });
  });
};

//Verify OTP
const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email.toLowerCase()], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    if (user.otp != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otp_expire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });
  });
};

//Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updateSql = `
    UPDATE users 
    SET password = ?, otp = NULL, otp_expire = NULL 
    WHERE email = ?
  `;

  db.query(updateSql, [hashedPassword, email.toLowerCase()], (err) => {
    if (err) return res.status(500).json(err);

    res.json({ message: "Password updated successfully" });
  });
};

//GET EMPLOYEES
const getEmployees = (req, res) => {
  const sql = "SELECT id, name, email FROM users WHERE role = 'employee'";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(result);
  });
};

// GET NOTIFICATIONS
const getNotifications = (req, res) => {
  const { email } = req.params;

  const sql = "SELECT * FROM notifications WHERE user_email = ? ORDER BY created_at DESC";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }

    res.json(result);
  });
};
// ADD TO GROUP 
const addToGroup = (req, res) => {
  const { email, groupName } = req.body;

  const message = `You are added to group ${groupName}`;

  const sql = "INSERT INTO notifications (user_email, message) VALUES (?, ?)";

  db.query(sql, [email, message], (err) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({ message: "Error saving notification" });
    }

    console.log("Notification saved");
    res.json({ message: "Notification sent" });
  });
};

// SHARE FILE TO GROUP
const shareFileToGroup = (req, res) => {
  const { fileName, fileUrl, emails } = req.body;

  const sql = "INSERT INTO shared_files (file_name, file_url, user_email) VALUES ?";

  const values = emails.map(email => [fileName, fileUrl, email]);

  db.query(sql, [values], (err) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({ message: "Error sharing file" });
    }

    res.json({ message: "File shared successfully" });
  });
};
// GET SHARED FILES
const getSharedFiles = (req, res) => {
  const { email } = req.params;

  const sql = "SELECT * FROM shared_files WHERE user_email = ? ORDER BY created_at DESC";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({ message: "Error fetching files" });
    }

    res.json(result);
  });
};
// Encryption download file with watermark
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb, degrees } = require("pdf-lib");

const downloadFile = async (req, res) => {
  try {
   const filename = decodeURIComponent(req.params.filename);
   console.log("Decoded filename:", filename);

    // temporary
    const employeeId = "EMP-101";  
    const employeeEmail = "nikhill@gmail.com";
    const date = new Date().toLocaleString();

    const filePath = path.join(__dirname, "../uploads", filename);
    console.log("PATH:", filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    //  PDF FILE
    if (filename.endsWith(".pdf")) {
      const existingPdfBytes = fs.readFileSync(filePath);

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();


pages.forEach((page) => {
  const { width, height } = page.getSize();
//watermark
  page.drawText(
    `DOWNLOADED BY ${employeeId}`,
    {
      x: width / 2 - 150,   
      y: height / 2,
      size: 40,             
      color: rgb(0.6, 0.6, 0.6), 
      rotate: degrees(45),  
      opacity: 0.3          
    }
  );
});

      const pdfBytes = await pdfDoc.save();

      const newFilePath = path.join(__dirname, "../temp", filename);
      fs.writeFileSync(newFilePath, pdfBytes);

   res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", "inline");
return res.sendFile(newFilePath);


    }

    // DOCX FILE 
    else if (filename.endsWith(".docx")) {
     
      const content = fs.readFileSync(filePath);

      const newFilePath = path.join(__dirname, "../temp", filename);
      fs.writeFileSync(newFilePath, content);

      return res.download(newFilePath);
    }

    else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//CREATE TASK 
const createTask = (req, res) => {
  const {
    title,
    description,
    
    assignTo,
    priority,
    fileName,
    issueDate,
    deadline
  } = req.body;

  const sql = `
    INSERT INTO tasks
    (title, description, assign_to, priority, file_name, issue_date, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, JSON.stringify(assignTo), priority, fileName, issueDate, deadline],
    (err, result) => {
      if (err) {
        console.log("TASK ERROR:", err);
        return res.status(500).json({ message: "Task create failed" });
      }

      res.json({ message: "Task created successfully" });
    }
  );
};


const getEmployeeTasks = (req, res) => {

  const email = req.params.email;

  const sql = "SELECT * FROM tasks";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    // employee ke email ke hisab se filter
    const filteredTasks = result.filter(task => {

  let assignedUsers = [];

  try {
    assignedUsers = JSON.parse(task.assign_to);
  } catch {
    assignedUsers = [];
  }

  if (
  assignedUsers === "all" ||
  (Array.isArray(assignedUsers) &&
   assignedUsers.includes("all"))
) {
  return true;
}

  if (Array.isArray(assignedUsers)) {
    return assignedUsers.includes(email);
  }

  return false;

});

    res.json(filteredTasks);

  });

};

const submitTask = (req, res) => {

  const {
    taskId,
    employeeEmail,
    employeeName,
    description,
    fileName,
    taskTitle
  } = req.body;

  // FIRST CHECK
  const checkSql = `
    SELECT * FROM task_submissions
    WHERE task_id = ?
    AND employee_email = ?
  `;

  db.query(
    checkSql,
    [taskId, employeeEmail],
    (checkErr, checkResult) => {

      if (checkErr) {
        console.log(checkErr);

        return res.status(500).json({
          message: "Database error"
        });
      }

      // ✅ IF ALREADY EXISTS → UPDATE
      if (checkResult.length > 0) {

        const updateSql = `
          UPDATE task_submissions
          SET
            description = ?,
            file_name = ?,
            status = 'pending',
            reject_note = NULL,
            reviewed_at = NULL,
            submitted_at = NOW()
          WHERE task_id = ?
          AND employee_email = ?
        `;

        db.query(
          updateSql,
          [
            description,
            fileName,
            taskId,
            employeeEmail
          ],
          (updateErr) => {

            if (updateErr) {
              console.log(updateErr);

              return res.status(500).json({
                message: "Update failed"
              });
            }

            return res.json({
              message: "Task resubmitted successfully"
            });

          }
        );

      }

      // ✅ FIRST TIME INSERT
      else {

        const insertSql = `
          INSERT INTO task_submissions
          (
            task_id,
            employee_email,
            employee_name,
            task_title,
            description,
            file_name,
            status
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertSql,
          [
            taskId,
            employeeEmail,
            employeeName,
            taskTitle,
            description,
            fileName,
            "pending"
          ],
          (insertErr) => {

            if (insertErr) {
              console.log(insertErr);

              return res.status(500).json({
                message: "Insert failed"
              });
            }

            return res.json({
              message: "Task submitted successfully"
            });

          }
        );

      }

    }
  );

};
const getTaskSubmissions = (req, res) => {

  const sql = `
    SELECT * FROM task_submissions
    ORDER BY submitted_at DESC
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log("FETCH ERROR:", err);

      return res.status(500).json({
        message: "Database error"
      });
    }

    res.json(result);

  });

};

const approveSubmission = (req, res) => {

  const { id } = req.params;

  // APPROVE UPDATE
  const sql = `
    UPDATE task_submissions
    SET
      status = 'approved',
      reviewed_at = NOW()
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {

    if (err) {

      console.log("APPROVE ERROR:", err);

      return res.status(500).json({
        message: "Database error"
      });

    }

    // GET EMPLOYEE INFO
    const getEmpSql = `
      SELECT employee_email, task_title
      FROM task_submissions
      WHERE id = ?
    `;

    db.query(getEmpSql, [id], (err2, result) => {

      if (err2) {

        console.log("GET EMP ERROR:", err2);

        return res.status(500).json({
          message: "Employee fetch failed"
        });

      }

      if (result.length > 0) {

        const employeeEmail = result[0].employee_email;

        const taskTitle = result[0].task_title;

        // NOTIFICATION
        const notifSql = `
          INSERT INTO notifications (user_email, message)
          VALUES (?, ?)
        `;

        db.query(
          notifSql,
          [
            employeeEmail,
            `Your task "${taskTitle}" was approved by admin`
          ],
          (notifErr) => {

            if (notifErr) {
              console.log("NOTIFICATION ERROR:", notifErr);
            }

          }
        );

      }

      // FINAL RESPONSE
      res.json({
        message: "Submission approved"
      });

    });

  });

};

const rejectSubmission = (req, res) => {


  console.log("REQ BODY:", req.body);
console.log("REJECT NOTE:", req.body.rejectNote);
console.log("TYPE:", typeof req.body.rejectNote);

  const { id } = req.params;
  const { rejectNote } = req.body;

  console.log("REJECT ID:", id);

  const sql = `
UPDATE task_submissions
SET
  status = 'rejected',
  reject_note = ?,
  reviewed_at = NOW()
WHERE id = ?
`;

  console.log("RUNNING UPDATE...");

  db.query(sql, [rejectNote || "", Number(id)], (err, result) => {

    console.log("UPDATE RESULT:", result);

    if (err) {

      console.log("REJECT ERROR:", err);

      return res.status(500).json({
        message: "Database error"
      });

    }

    if(result.affectedRows === 0){

      return res.status(404).json({
        message: "No submission found"
      });

    }

    // EMPLOYEE INFO GET
    const getEmpSql = `
      SELECT employee_email, task_title
      FROM task_submissions
      WHERE id = ?
    `;

    db.query(getEmpSql, [id], (err2, result) => {

      if (err2) {
        console.log("GET EMP ERROR:", err2);
      }

      if (result.length > 0) {

        const employeeEmail = result[0].employee_email;

        const taskTitle = result[0].task_title;

        const notifMsg =
          `Your task "${taskTitle}" was rejected`;

        const notifSql = `
          INSERT INTO notifications (user_email, message)
          VALUES (?, ?)
        `;

        db.query(
          notifSql,
          [employeeEmail, notifMsg],
          (err3) => {

            if (err3) {
              console.log("NOTIFICATION ERROR:", err3);
            }

          }
        );

      }

    });

    res.json({
      message: "Submission rejected"
    });

  });

};
const getEmployeeSubmissions = (req, res) => {

  const { email } = req.params;

  const sql = `
    SELECT *
    FROM task_submissions
    WHERE employee_email = ?
  `;

  db.query(sql, [email], (err, result) => {

    if (err) {

      console.log("SUBMISSION FETCH ERROR:", err);

      return res.status(500).json({
        message: "Database error"
      });

    }

    res.json(result);

  });

};

module.exports = { registerUser, loginUser, sendOtp, verifyOtp,
  resetPassword , getEmployees, getNotifications, addToGroup, shareFileToGroup, 
  getSharedFiles, downloadFile,
createTask, getEmployeeTasks, submitTask, getTaskSubmissions, approveSubmission, rejectSubmission,
 getEmployeeSubmissions};

 