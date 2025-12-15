export interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  createdAt: string;
  reviews?: Review[];
  enrollments?: Enrollment[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userId: number;
  courseId: number;
  createdAt: string;
  user?: User;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  progress: number;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
}
