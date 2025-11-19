import * as AccountHolder from "../controllers/accountholder.controller.js"
import express from "express"

const router = express.Router()

router.post("/create", AccountHolder.accountholderCreate)
router.put("/update/:id", AccountHolder.accountholderUpdate)
router.get("/stats", AccountHolder.getAccountHoldersCountController)
router.get("/:id", AccountHolder.getAccountHolderController)
router.get("/", AccountHolder.getAllAccountHoldersController)
router.delete("/:id", AccountHolder.deleteAccountHolderController)

export default router