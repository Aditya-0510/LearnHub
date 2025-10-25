import { Router } from "express";
import authMiddleware from "../middleware.js";
import {
  getAllCourses,
  createCourse,
  addLesson,
  getLessons,
  enrollCourse,
  getUserCourses,
  addReview,
  getReviews,
  getInstructorCourses
} from "../controllers/courseController.js";

const courseRouter = Router();

courseRouter.get("/", getAllCourses)

courseRouter.use(authMiddleware)

courseRouter.post("/create", createCourse)              //instructor
courseRouter.post("/:courseId/lessons", addLesson)      //instructor
courseRouter.get("/instructor/courses", getInstructorCourses)
courseRouter.get("/:courseId/lessons", getLessons)      //student + i
courseRouter.post("/:courseId/join", enrollCourse)      //student
courseRouter.get("/student/courses", getUserCourses)    //student
courseRouter.post("/:courseId/reviews", addReview)      //student
courseRouter.get("/:courseId/reviews", getReviews)      //student + i

export default courseRouter