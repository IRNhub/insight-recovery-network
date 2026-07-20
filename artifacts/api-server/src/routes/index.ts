import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import resourceLeadsRouter from "./resource-leads";
import assessmentsRouter from "./assessments";
import articlesRouter from "./articles";
import researchRouter from "./research";
import adminResearchRouter from "./admin-research";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(resourceLeadsRouter);
router.use(assessmentsRouter);
router.use(articlesRouter);
router.use(researchRouter);
router.use(adminResearchRouter);

export default router;
