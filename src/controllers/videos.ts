import { Request, Response, NextFunction } from "express";
import Videos from "../models/Videos";

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
            resultsCount: videos.length,
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
