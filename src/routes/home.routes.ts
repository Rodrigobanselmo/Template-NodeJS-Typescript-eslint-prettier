import { Router } from 'express';
import { HomeController } from '../controllers/HomeController';

const homeRoutes = Router();
const homesController = new HomeController();
homeRoutes.get('/', homesController.handle);

export { homeRoutes };
