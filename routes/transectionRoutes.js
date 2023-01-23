const express = require("express");
const {
  addTransaction,
  getAllTransaction,
  editTransaction,
  deleteTransaction,
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

//get transections
router.post("/get-transection", getAllTransaction);

module.exports = router;
