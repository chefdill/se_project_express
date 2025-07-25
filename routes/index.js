const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");
const {
  validateUserBody,
  validateInfoBody
} = require("../middlewares/validation")

router.use('/items', clothingItem);
router.use("/users", userRouter);
router.post("/signin", validateUserBody, login);
router.post("/signup", validateInfoBody, createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message:"Router not Found" });
});

module.exports = router;
