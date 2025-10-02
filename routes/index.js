const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND_CODE } = require("../utils/errors/not-found-err");
const {
  validateUserBody,
  validateInfoBody
} = require("../middlewares/validation")

router.use('/items', clothingItem);
router.use("/users", userRouter);
router.post("/signin", validateUserBody, login);
router.post("/signup", validateInfoBody, createUser);

router.use((_req, _res, next) => {
  next(new NOT_FOUND_CODE("Router not Found"));
});

module.exports = router;
