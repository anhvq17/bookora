import routes from "./index.js";
import { Router } from "express";
import {
    addVariant,
    updateVariant,
    deleteVariant,
    getAllVariants,
    getVariantById,
} from "../controllers/variantController.js";
const variantRoutes = Router();
//API variant
variantRoutes.get("/", getAllVariants);
variantRoutes.post("/add", addVariant);
variantRoutes.put("/:id", updateVariant);
variantRoutes.delete("/:id", deleteVariant);
variantRoutes.get("/:id", getVariantById);
export default variantRoutes;