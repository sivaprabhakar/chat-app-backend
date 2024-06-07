import express from 'express'
import register from '../controller/register.js'
import checkEmail from '../Controller/checkEmail.js'
import checkPassword from '../controller/passwordCheck.js'
import userDetails from '../Controller/userDetails.js'
import logout from '../Controller/logout.js'
import updateUserDetails from '../Controller/updateUserDetails.js'
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