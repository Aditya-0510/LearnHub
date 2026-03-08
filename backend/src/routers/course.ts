import { Router } from "express";
import authMiddleware from "../middleware";
import {
  getAllCourses,
  createCourse,
  addLesson,
  getLessons,
  enrollCourse,
  getUserCourses,
  addReview,
  getReviews,
  getInstructorCourses,
  getCourseById,
  updateLesson,
  uploadLessonVideo,
  getLessonVideo,
  deleteLessonVideo 
} from "../controllers/courseController";

import { videoUpload } from "../middleware/upload";

const courseRouter = Router();

courseRouter.get("/", getAllCourses)                    //public

courseRouter.use(authMiddleware)

courseRouter.post("/", createCourse)                    //i
courseRouter.get("/instructor", getInstructorCourses)   //i
courseRouter.get("/enrolled", getUserCourses)           //s
courseRouter.get("/:courseId", getCourseById)           //s

courseRouter.post("/:courseId/lessons", addLesson)      //i
courseRouter.put("/:courseId/lessons/:lessonId", updateLesson) //i
courseRouter.get("/:courseId/lessons", getLessons)      //s + i

courseRouter.post("/:courseId/enroll", enrollCourse)     //s

courseRouter.post("/:courseId/reviews", addReview)      //s
courseRouter.get("/:courseId/reviews", getReviews)      //s + i

courseRouter.post("/:courseId/lessons/:lessonId/video",videoUpload.single("video"),uploadLessonVideo)      //i
courseRouter.get("/:courseId/lessons/:lessonId/video", getLessonVideo);
courseRouter.delete("/:courseId/lessons/:lessonId/video", deleteLessonVideo);

export default courseRouter