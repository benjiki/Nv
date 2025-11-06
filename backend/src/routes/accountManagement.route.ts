import express from "express"
import * as AccountManagement from "../controllers/accountManagment.controller.js"


const router = express.Router()

router.post("/deposit", AccountManagement.createDepositController)
router.post("/loan", AccountManagement.createLoanController)


export default router