import express from 'express';
import {Login, Whoami} from '@domain/auth/AuthService';
const router = express.Router();

router.use('/', Login);
router.get('/whoami', Whoami)

export default router;