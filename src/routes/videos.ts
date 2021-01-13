import express from "express";
import {
    getVideos,
    addVideo,
    updateVideo,
    deleteVideo,
} from "../controllers/videos";

const router = express.Router();

router.route("/").get(getVideos).post(addVideo);
router.route("/:id").delete(deleteVideo).post(updateVideo);

export default router;
