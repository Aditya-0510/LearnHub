import type { Request, Response } from "express";
import client from "../prismaClient";
import { generateSignedVideoUrl } from "../utils/getSignedUrl";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";

export const getAllCourses = async (req: Request, res: Response) => {
    try {
        const response = await client.course.findMany({});
        // console.log(response);

        res.json({
            courses: response
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fecthing courses",
        });
    }
}

export const getCourseById = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ error: "Course ID is required" });
        }
        const id = parseInt(courseId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid course ID" });
        }
        const course = await client.course.findUnique({
            where: {
                id
            },
            include: {
                instructor: {
                    select: {
                        username: true
                    }
                },
                _count: {
                    select: {
                        lessons: true,
                        enrollments: true
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ course });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fetching course",
        });
    }
}

export const createCourse = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    // console.log(user);
    if (user.role === "INSTRUCTOR") {
        try {
            const { title, description } = req.body;
            const response = await client.course.create({
                data: {
                    title: title,
                    description: description,
                    instructorId: user.id
                }
            })
            // console.log(response);

            res.json({
                message: "course added",
                course: response
            })
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
}

export const getInstructorCourses = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    // console.log(user);
    if (user.role === "INSTRUCTOR") {
        try {
            const courses = await client.course.findMany({
                where: {
                    instructorId: user.id
                },
            })
            // console.log(courses);

            res.json({
                courses: courses
            })
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in fecthcing courses",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}

export const addLesson = async (req: Request, res: Response) => {
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
            })
            // console.log(response);

            res.json({
                message: "course added",
                lesson: response
            })
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
}

export const getLessons = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    try {
        const { courseId } = req.params;
        const course = await client.course.findUnique({
            where: {
                id: Number(courseId)
            }
        })
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (user.role === "STUDENT") {
            const enrollment = await client.enrollment.findFirst({
                where: {
                    courseId: Number(courseId)
                }
            })
            if (!enrollment) {
                return res.status(404).json({ message: "You are not enrolled in this course" });
            }
        }
        if (user.role === "INSTRUCTOR") {
            const match = (course.instructorId === user.id)
            if (!match) {
                return res.status(404).json({ message: "You don't own this course" });
            }
        }

        const lessons = await client.lesson.findMany({
            where: {
                courseId: Number(courseId)
            },
            orderBy: {
                id: 'asc'
            }
        })
        // console.log(lessons);

        res.json({
            lessons: lessons
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fecthing lessons",
        });
    }
}

export const updateLesson = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "INSTRUCTOR") {
        try {
            const { title, content } = req.body;
            const { courseId, lessonId } = req.params;

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

            const response = await client.lesson.update({
                where: {
                    id: Number(lessonId),
                    courseId: Number(courseId) // Ensure lesson belongs to course
                },
                data: {
                    title: title,
                    content: content
                }
            })
            // console.log(response);

            res.json({
                message: "lesson updated",
                lesson: response
            })
        }
        catch (error) {
            console.error(error);
            // Handle record not found if lessonId doesn't exist or match
            res.status(500).json({
                message: "Error in updating lesson",
            });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
}


export const enrollCourse = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    if (user.role === "STUDENT") {
        try {
            const { courseId } = req.params;

            const existingEnrollment = await client.enrollment.findFirst({
                where: {
                    userId: user.id,
                    courseId: Number(courseId)
                }
            });

            if (existingEnrollment) {
                return res.status(400).json({ message: "You are already enrolled in this course" });
            }

            const response = await client.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: Number(courseId)
                }
            })
            // console.log(response);

            res.json({
                message: "course enrolled",
                course: response
            })
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
}

export const getUserCourses = async (req: Request, res: Response) => {
    //@ts-ignore
    const user = req.user;
    // console.log('User object:', user);
    // console.log('User role:', user?.role);
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
            })
            // console.log(courses);
            if (!courses || courses.length === 0) {
                return res.status(404).json({ message: "You are not enrolled in any courses" });
            }
            res.json({
                courses: courses
            })
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Error in fetching courses",
            });
        }
    }
    else {
        console.log('User is not a student, returning 403')
        res.status(403).json({ message: "Unauthorized" });
    }
}

export const addReview = async (req: Request, res: Response) => {
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
            })
            // console.log(response);
            res.json({
                message: "review added",
                review: response
            })
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
}

export const getReviews = async (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const reviews = await client.review.findMany({
            where: {
                courseId: Number(courseId)
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
                course: {
                    select: {
                        title: true,
                        instructor: {
                            select: {
                                username: true
                            }
                        }
                    }
                }
            }
        })
        // console.log(reviews);
        res.json({
            reviews: reviews
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error in fetching reviews",
        });
    }
}

export const uploadLessonVideo = async (req: any, res: any) => {
  try {
    const { lessonId } = req.params;

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        message: "No video uploaded"
      });
    }

    

    const lesson = await client.lesson.findUnique({
      where: { id: Number(lessonId) }
    });

    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found"
      });
    }

    // 🔹 delete old video if exists
    if (lesson.videoKey) {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: lesson.videoKey
        })
      );
    }

    const videoKey = file.key;

    // update key in DB
    await client.lesson.update({
      where: { id: Number(lessonId) },
      data: {
        videoKey: videoKey
      }
    });

    // Generate signed URL
    const signedUrl = await generateSignedVideoUrl(videoKey);

    res.json({
      message: "Video uploaded successfully",
      videoUrl: signedUrl,
      lesson
    });

  } catch (err) {
    res.status(500).json({
      message: "Error uploading video"
    });
  }

};


export const getLessonVideo = async (req: any, res: any) => {
  try {
    const { lessonId } = req.params;

    const lesson = await client.lesson.findUnique({
      where: { id: Number(lessonId) }
    });

    if (!lesson || !lesson.videoKey) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    const url = await generateSignedVideoUrl(lesson.videoKey);

    res.json({
      videoUrl: url
    });

  } catch (err) {
    res.status(500).json({
      message: "Error generating video URL"
    });
  }
};

export const deleteLessonVideo = async (req: any, res: any) => {
  try {
    const { lessonId } = req.params;

    const lesson = await client.lesson.findUnique({
      where: { id: Number(lessonId) }
    });

    if (!lesson || !lesson.videoKey) {
      return res.status(404).json({
        message: "Video not found"
      });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: lesson.videoKey
      })
    );

    await client.lesson.update({
      where: { id: Number(lessonId) },
      data: {
        videoKey: null
      }
    });

    res.json({
      message: "Video deleted"
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete video"
    });
  }
};