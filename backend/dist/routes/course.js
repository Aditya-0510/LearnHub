import { Router } from "express";
import authMiddleware from "../middleware.js";
import client from "./../prismaClient.js";
const courseRouter = Router();
courseRouter.get("/", async (req, res) => {
    try {
        const response = await client.course.findMany({});
        console.log(response);
        res.json({
            courses: response
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fecthing courses",
        });
    }
});
courseRouter.use(authMiddleware);
courseRouter.post("/create", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    console.log(user);
    if (user.role === "INSTRUCTOR") {
        try {
            const { title, description } = req.body;
            const response = await client.course.create({
                data: {
                    title: title,
                    description: description,
                    instructorId: user.id
                }
            });
            console.log(response);
            res.json({
                message: "course added",
                course: response
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in adding course",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
courseRouter.post("/:courseId/lessons", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "INSTRUCTOR") {
        try {
            const { title, content } = req.body;
            const { courseId } = req.params;
            const course = await client.course.findUnique({
                where: {
                    id: Number(courseId)
                },
            });
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
            if (course.instructorId !== user.id) {
                return res.status(403).json({ message: "You don't own this course" });
            }
            const response = await client.lesson.create({
                data: {
                    title: title,
                    content: content,
                    courseId: Number(courseId),
                }
            });
            console.log(response);
            res.json({
                message: "course added",
                lesson: response
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in adding course",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
courseRouter.get("/:courseId/lessons", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    try {
        const { courseId } = req.params;
        const course = await client.course.findUnique({
            where: {
                id: Number(courseId)
            }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        if (user.role === "STUDENT") {
            const enrollment = await client.enrollment.findFirst({
                where: {
                    courseId: Number(courseId)
                }
            });
            if (!enrollment) {
                return res.status(404).json({ message: "You are not enrolled in this course" });
            }
        }
        if (user.role === "INSTRUCTOR") {
            const match = (course.instructorId === user.id);
            if (!match) {
                return res.status(404).json({ message: "You don't own this course" });
            }
        }
        const lessons = await client.lesson.findMany({
            where: {
                courseId: Number(courseId)
            }
        });
        console.log(lessons);
        res.json({
            lessons: lessons
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fecthing lessons",
        });
    }
});
courseRouter.post("/:courseId/join", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "STUDENT") {
        try {
            const { courseId } = req.params;
            const response = await client.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: Number(courseId)
                }
            });
            console.log(response);
            res.json({
                message: "course enrolled",
                course: response
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in enrolling course",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
courseRouter.get("/:userId/courses", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "STUDENT") {
        try {
            const userId = user.id;
            const courses = await client.enrollment.findMany({
                where: {
                    userId: userId
                },
                include: {
                    course: true
                }
            });
            console.log(courses);
            if (!courses) {
                return res.status(404).json({ message: "You are not enrolled in any courses" });
            }
            res.json({
                courses: courses
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in fetching courses",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
courseRouter.post("/:courseId/reviews", async (req, res) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "STUDENT") {
        try {
            const { courseId } = req.params;
            const { rating, comment } = req.body;
            const response = await client.review.create({
                data: {
                    rating: rating,
                    comment: comment,
                    userId: user.id,
                    courseId: Number(courseId)
                }
            });
            console.log(response);
            res.json({
                message: "review added",
                review: response
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in adding review",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
export default courseRouter;
