const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
// const { getUsers, createUser, getUser } = require("../controllers/users");

// router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
// router.post("/", createUser);


module.exports = router;