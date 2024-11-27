const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { NOT_FOUND } = require("../utils/errors");

router.use('/items', clothingItem);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message:"Router not Found" });
});

module.exports = router;
