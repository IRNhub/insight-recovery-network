import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import assessmentsRouter from "./assessments";
import articlesRouter from "./articles";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(assessmentsRouter);
router.use(articlesRouter);

export default router;
