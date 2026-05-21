# Sarvi Creation

Sarvi Creation is a premium e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js), tailored to deliver a "Quiet Luxury" user experience.

## Architecture & Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, GSAP.
- **Backend:** Node.js, Express, MongoDB (Mongoose).
- **Authentication:** JWT (JSON Web Tokens).
- **Asset Management:** Cloudinary integration for optimized image delivery.

## Design Philosophy: "Quiet Luxury"
The platform is designed to emulate high-end editorial and luxury storefronts. This relies heavily on:
1. **Typography:** Generous use of serif fonts for headings, combined with wide-tracked uppercase sans-serif utility text.
2. **Minimalism:** Absence of generic colorful backgrounds, heavy box shadows, or cluttered borders. We utilize stark white space, razor-thin borders, and monochromatic palettes.
3. **Fluid Motion:** Interactions are guided by elegant, physics-based animations (via Framer Motion and GSAP).

## Performance Optimization Strategy
To ensure zero scroll-jank and immediate responsiveness, several performance optimizations have been implemented:

- **Simplified Navigation:** The heavy, DOM-intensive Mega-Menu was removed in favor of a clean, highly-performant simple link structure. This eliminated massive layout thrashing during scroll events.
- **Main-Thread Offloading:** CSS properties that trigger expensive repaints (`backdrop-filter`, `mask-image`) have been replaced with performant `radial-gradient` overlays and GSAP-based spotlighting.
- **Visibility-Aware Rendering:** Implemented `IntersectionObserver` across heavy components (like `ChromaGrid`) to disable tracking/animations when off-screen. CSS `content-visibility: auto` is used on sections to defer rendering off-screen layouts.
- **Canvas Throttling:** The global `Silk` WebGL background is capped at 30 FPS, has antialiasing disabled, and is hidden on mobile devices to prevent thermal throttling and battery drain.

## Admin Architecture
The backend control center is accessible at `/admin` for authorized users.
- **Recent Updates:** The Admin Dashboard was overhauled from a generic SaaS template into a "Quiet Luxury" editorial layout.
- **Features:** It features live data widgets including a real-time "Recent Orders" feed, revenue charts, and detailed low-stock alerts.

### Default Admin Access
If running locally via seed data:
- **Email:** `admin@sarvicreation.com`
- **Password:** `admin123`

## Running Locally
Use the provided batch/shell scripts to start both frontend and backend concurrently:
- **Windows:** Run `start_dev.bat`
- **Mac/Linux:** Run `./start_dev.sh`

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5003`.
