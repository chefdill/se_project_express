const router = require("express").Router();
const { getUsers } = require("../controller/user");

router.get("/", getUsers);
router.get("/:userId", () => console.log("GET user by ID"));
router.post("/", () => console.log("POST user"));

module.exports = router;