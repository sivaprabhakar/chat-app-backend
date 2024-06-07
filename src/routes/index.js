import express from 'express'
import register from '../controller/register.js'
import checkEmail from '../controller/checkEmail.js'
import checkPassword from '../controller/passwordCheck.js'
import userDetails from '../controller/userDetails.js'
import logout from '../controller/logout.js'
import updateUserDetails from '../controller/updateUserDetails.js'
import searchUser from '../controller/searchUser.js'


const router = express.Router()

router.post('/register',register)

router.post('/email',checkEmail)

router.post("/password",checkPassword)

router.get('/user-details',userDetails)

router.get('/logout',logout)

router.post('/update-user',updateUserDetails)

router.post('/search',searchUser)
export default router