import * as AccountHolder from "../controllers/accountholder.controller.js"
import express from "express"

const router = express.Router()

router.post("/create", AccountHolder.accountholderCreate)
router.put("/update/:id", AccountHolder.accountholderUpdate)



export default router