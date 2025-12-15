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
  getCourseById
} from "../controllers/courseController";

const courseRouter = Router();

courseRouter.get("/", getAllCourses)                    //public

courseRouter.use(authMiddleware)

courseRouter.post("/", createCourse)                    //i
courseRouter.get("/instructor", getInstructorCourses)   //i
courseRouter.get("/:courseId", getCourseById)           //s

courseRouter.post("/:courseId/lessons", addLesson)      //i
courseRouter.get("/:courseId/lessons", getLessons)      //s + i

courseRouter.post("/:courseId/enroll", enrollCourse)     //s
courseRouter.get("/enrolled", getUserCourses)           //s

courseRouter.post("/:courseId/reviews", addReview)      //s
courseRouter.get("/:courseId/reviews", getReviews)      //s + i

export default courseRouter