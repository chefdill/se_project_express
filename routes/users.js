const router = require("express").Router();
const { getUsers } = require("../controller/users");

router.get("/", getUsers);
router.get("/:userId", getUsers);
router.post("/", getUsers);


module.exports = router;