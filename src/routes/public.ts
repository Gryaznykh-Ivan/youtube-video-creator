import Router from 'koa-router'
import controllers from '../controllers'

const router = new Router();

router.post("/addVideoToRender", controllers.api.addVideoToRender);

export default router.routes();