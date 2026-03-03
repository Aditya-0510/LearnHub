# Course App

A comprehensive course management application designed for instructors to create and manage courses and for students to enroll and learn. The application is fully containerized using Docker and includes an automated CI/CD pipeline powered by Jenkins

## Project Features

-   **Authentication**: Secure user login and registration system using JWT (JSON Web Tokens).
-   **Instructor Dashboard**: Dedicated dashboard for instructors to create courses, manage lessons, and track content.
-   **Student Experience**: Intuitive interface for students to browse available courses, enroll, and access learning materials.
-   **Course Reviews**: System for students to leave reviews and ratings for courses they have taken.
-   **Responsive Design**: Fully responsive user interface built with Tailwind CSS, ensuring a seamless experience across desktop and mobile devices.
- **Dockerized Backend**: Backend and database are containerized using Docker for consistent development and deployment environments.
- **CI/CD Pipeline**: Automated build and deployment pipeline implemented using Jenkins.
- **Automated Deployment**: On every code update, Jenkins builds a new Docker image and redeploys the backend container.

## Tech Stack

### Frontend
-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)

### Backend
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express 5](https://expressjs.com/)
-   **ORM**: [Prisma 6](https://www.prisma.io/)
-   **Database**: PostgreSQL 
-   **Authentication**: JWT & Bcrypt

## DevOps & Infrastructure

- **Containerization**: Docker (Node 18 Alpine image)
- **Database Container**: PostgreSQL 15 running in a separate container
- **CI/CD Tool**: Jenkins (running inside Docker)
- **Container Orchestration**: Docker CLI via mounted Docker socket
- **Deployment Strategy**:
  - GitHub push triggers Jenkins pipeline
  - Jenkins builds Docker image
  - Stops previous container
  - Deploys new container
  - Verifies successful startup via health check