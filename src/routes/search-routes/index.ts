
import express from "express"
import { GetAllUsers, GetSummaryFromAi, GetTop2Document } from "../../controllers/search";

const SearchRouter = express.Router();


SearchRouter.post("/top-suggestion", GetTop2Document);
SearchRouter.post("/ai-summarize", GetSummaryFromAi);
SearchRouter.post("/all-users", GetAllUsers)
export default SearchRouter;
