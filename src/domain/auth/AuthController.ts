import express from 'express';
import {Login, Whoami} from '@domain/auth/service/AuthService';
const router = express.Router();

router.post('/', Login);
router.get('/', Whoami)

export default router;