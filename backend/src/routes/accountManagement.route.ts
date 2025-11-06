import express from "express"
import * as AccountManagement from "../controllers/accountManagment.controller.js"


const router = express.Router()

router.post("/deposit", AccountManagement.createDepositController)
router.post("/loan", AccountManagement.createLoanController)
router.post("/transfer", AccountManagement.createTransferController)
router.post("/repayment", AccountManagement.createRepaymentController)

export default router