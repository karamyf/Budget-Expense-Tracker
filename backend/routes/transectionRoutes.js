const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransaction,
  addFavoriteTransaction,
} = require("../controllers/transectionCtrl");

//router object
const router = express.Router();

//routes
//add transection POST MEthod
router.post("/add-transection", addTransaction);
//Edit transection POST MEthod
router.post("/edit-transection", editTransaction);
//Delete transection POST MEthod
router.post("/delete-transection", deleteTransaction);

//get transactions
router.post("/get-transection", getAllTransaction);

//add transaction to fav
router.post("/add-to-favorites", addFavoriteTransaction);


module.exports = router;
