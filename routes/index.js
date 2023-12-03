const router = require("express").Router();

const authRoute = require("./auth");
const userRoute = require("./user");
const postRoute = require("./post");
const tuitionBatchRoute = require("./TuitionBatch");
const adminRoute = require("./admin");
const auth = require("../middleware/auth");
// const userRoute = require("./user");
// const AdminAttendanceRoute = require("./admin-attendance");
// const studentAttendanceRoutes = require("./student-attendance");
// const auth = require("../middleware/auth");

// ? for login  and sign up
router.use("/api/v1/auth", authRoute);

// ? for user data
router.use("/api/v1/user", userRoute);

// ? for user post
router.use("/api/v1/post", postRoute);

// ? for Tuition Batch
router.use("/api/v1/TuitionBatch", tuitionBatchRoute);

// ? for Tuition Batch
router.use("/api/v1/admin", adminRoute);

// router.use("/api/v1/users", auth, userRoute);

// router.use("/api/v1/admin/attendance", auth, AdminAttendanceRoute);

// router.use("/api/v1/student/attendance", auth, studentAttendanceRoutes);

module.exports = router;
