import Router from 'koa-router'

import publicRouter from './public'

const router = new Router();

router.use(publicRouter);

export default router;