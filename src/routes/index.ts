import { Router } from 'express';
import { homeRoutes } from './home.routes';

const router = Router();

router.use('/', homeRoutes);

export { router };
