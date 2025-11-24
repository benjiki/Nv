import express from "express"
import * as AccountManagement from "../controllers/accountManagment.controller.js"


const router = express.Router()

router.post("/deposit", AccountManagement.createDepositController);
router.post("/loan", AccountManagement.createLoanController);
router.get("/loans", AccountManagement.AllLoansController);
router.post("/transfer", AccountManagement.createTransferController);
router.post("/repayment", AccountManagement.createRepaymentController);
router.get("/:id", AccountManagement.getTransactionByIdDataController);
router.put("/transfer/:id/reverse", AccountManagement.reverseTransactionController);
router.put("/deposit/:id/reverse", AccountManagement.reverseDepositController);
router.put("/repayment/:id/reverse", AccountManagement.reverseRepaymentController);
router.put("/loan/:id/reverse", AccountManagement.reverseLoanController);

router.get("/", AccountManagement.getTransactionDataController);

export default router