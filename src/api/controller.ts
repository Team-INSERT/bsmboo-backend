const express = require('express');
const router = express.Router();
import LoginController from './Login/Login.controller';


router.use('/oauth',LoginController)

export default router;