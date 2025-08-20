import express from 'express'

import { verifyToken } from '../middlewares/authMiddleware.js'
import { addToCart, checkCartStock, clearCart, getCart, removeFromCart, updateQuantity } from '../controllers/CartController.js'

const router = express.Router()
router.use(verifyToken)

router.get('/', getCart)
router.post('/add', addToCart)
router.post('/update', updateQuantity) 
router.post('/remove', removeFromCart)
router.post('/clear', clearCart)
router.get('/check-stock',verifyToken , checkCartStock);


export default router
