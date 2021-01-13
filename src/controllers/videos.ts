import { Request, Response, NextFunction } from "express";
import Videos from "../models/Videos";
import { VideoType } from "../types/video";

// ----------------------------------------------------------------
// CRUD endpoints
// ----------------------------------------------------------------

// @desc Add video
// @route POST /api/v1/videos
// @access Public
export const addVideo = async (req: Request, res: Response) => {
    try {
        const video = await Videos.create({ ...req.body });

        return res.status(201).json({
            success: true,
            data: video,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages: string[] = Object.values(error.errors).map(
                (value: any) => value.message
            );

            return res.status(400).json({
                success: false,
                error: messages,
            });
        } else {
            return res.status(500).json({
                success: false,
                error: `Server Error`,
            });
        }
    }
};

// @desc Get all videos
// @route GET /api/v1/videos
// @access Public
export const getVideos = async (req: Request, res: Response) => {
    try {
        const videos = await Videos.find();

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Update Video
// @route POST /api/v1/videos/:id
// @access Public
export const updateVideo = async (req: Request, res: Response) => {
    try {
        const newVideo = { ...req.body };
        const video = await Videos.findByIdAndUpdate(req.params.id, newVideo);

        if (!video) {
            return res.status(404).json({
                success: false,
                error: "Video not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Delete Video
// @route DELETE /api/v1/videos/:id
// @access Public
export const deleteVideo = async (req: Request, res: Response) => {
    try {
        const video = await Videos.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                error: "Video not found.",
            });
        }

        await video.remove();

        return res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// ----------------------------------------------------------------
// Method 1 - Query endpoints
// ----------------------------------------------------------------

// @desc Get videos sorted from newest to oldest
// @route GET /api/v1/videos/queryVideos
// @access Public

export const queryVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await Videos.find({ disabled: { $ne: true } })
            .sort({ date_added: "desc" })
            .exec((err: any, videos: any) => {
                console.log({ err }, { videos });

                return res.status(200).json({
                    success: true,
                    results: videos.length,
                    data: videos,
                });
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get videos with a specific tags
// @route GET /api/v1/videos/queryByTags
// @access Public

export const queryByTags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tags: string[] = (req.query.tags as string).split(",");
        const videos = await Videos.find({
            disabled: { $ne: true },
            tags: { $in: tags },
        });

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get thumbnails
// @route GET /api/v1/videos/queryThumbnails
// @access Public

export const queryThumbnails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await Videos.find(
            {
                disabled: { $ne: true },
            },
            { thumbnail: true, _id: false }
        );

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: videos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get disabled videos
// @route GET /api/v1/videos/queryDisabled
// @access Public

export const queryDisabledVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await Videos.find({
            disabled: { $ne: false },
        });

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: { disabledVideos: videos.length },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// ----------------------------------------------------------------
// Method 2 - Filter endpoints
// ----------------------------------------------------------------

// @desc Get videos sorted from newest to oldest
// @route GET /api/v1/videos/filterVideos
// @access Public

export const filterVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await Videos.find();

        const enabledVideos = videos.filter(
            (video: VideoType) => video.disabled !== true
        );

        const fromNewestToOldest = enabledVideos.sort(
            (a: VideoType, b: VideoType) => {
                (new Date(a.date_added) as any) -
                    (new Date(b.date_added) as any);
            }
        );

        return res.status(200).json({
            success: true,
            results: enabledVideos.length,
            data: fromNewestToOldest,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get videos with a specific tags
// @route GET /api/v1/videos/filterByTags
// @access Public

export const filterByTags = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tags: string[] = (req.query.tags as string).split(",");

        const videos = await Videos.find();

        const enabledVideos = videos.filter(
            (video: VideoType) => !video.disabled
        );

        const filteredVideos = enabledVideos.filter((video: VideoType) =>
            video.tags.some((video) => tags.includes(video))
        );

        return res.status(200).json({
            success: true,
            results: filteredVideos.length,
            data: filteredVideos,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get thumbnails
// @route GET /api/v1/videos/filterThumbnails
// @access Public

export const filterThumbnails = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await Videos.find();

        const enabledVideos = videos.filter(
            (video: VideoType) => !video.disabled
        );

        const thumbnails = enabledVideos.map((video: VideoType) => ({
            thumbnail: video.thumbnail,
        }));

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: thumbnails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};

// @desc Get disabled videos
// @route GET /api/v1/videos/filterDisabled
// @access Public

export const filterDisabledVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const videos = await Videos.find().filter(
            (video: VideoType) => video.disabled
        );

        return res.status(200).json({
            success: true,
            results: videos.length,
            data: { disabledVideos: videos.length },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Server Error`,
        });
    }
};
