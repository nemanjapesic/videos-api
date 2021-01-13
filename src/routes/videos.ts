import express from "express";
import {
    addVideo,
    getVideos,
    updateVideo,
    deleteVideo,
    queryVideos,
    queryByTags,
    queryThumbnails,
    queryDisabledVideos,
    filterVideos,
    filterByTags,
    filterThumbnails,
    filterDisabledVideos,
} from "../controllers/videos";

const router = express.Router();

router.route("/").get(getVideos).post(addVideo);
router.route("/:id").delete(deleteVideo).post(updateVideo);

router.route("/queryVideos").get(queryVideos);
router.route("/queryByTags").get(queryByTags);
router.route("/queryThumbnails").get(queryThumbnails);
router.route("/queryDisabled").get(queryDisabledVideos);

router.route("/filterVideos").get(filterVideos);
router.route("/filterByTags").get(filterByTags);
router.route("/filterThumbnails").get(filterThumbnails);
router.route("/filterDisabled").get(filterDisabledVideos);

export default router;
