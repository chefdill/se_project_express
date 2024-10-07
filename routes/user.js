const router = require("express").Router();

router.get("/user", () => console.log("GET user"));

module.exports = router;