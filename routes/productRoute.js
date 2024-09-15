import express from "express"
import  {handlePostProducts}  from "../controllers/productController.js"

const router = express.Router()

router.post("/postProducts",handlePostProducts)
// router.get("/", )

export default router