# Spectra Self-Auth

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Simon-Fontaine/spectra-self-auth?tab=MIT-1-ov-file)

**Spectra Self-Auth** is a **Next.js 15+** application designed primarily for Overwatch 2 e-sport **team management**—including rosters, schedules, and admin tooling—while showcasing a robust, **reusable** custom authentication system. Its modular auth logic (featuring sessions, CSRF tokens, email verification, and rate-limiting) can be easily **ported** or **adapted** into other Next.js projects.

---

## Table of Contents

- [Overview](#overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Project Structure](#project-structure)  
- [Getting Started](#getting-started)  
  - [Requirements](#requirements)  
  - [1. Clone the Repository](#1-clone-the-repository)  
  - [2. Install Dependencies](#2-install-dependencies)  
  - [3. Set Up Environment Variables](#3-set-up-environment-variables)  
  - [4. Run Database Migrations](#4-run-database-migrations)  
  - [5. Start the Development Server](#5-start-the-development-server)  
- [Scripts](#scripts)  
- [Deployment](#deployment)  
- [Authentication Flow](#authentication-flow)  
- [Security Considerations](#security-considerations)  
- [Contributing](#contributing)  
- [License](#license)  
- [Additional Resources](#additional-resources)

---

## Overview

**Spectra Self-Auth** is a Next.js website that manages an Overwatch 2 e-sport team—from rosters to user roles and schedules—backed by a **bespoke, self-contained auth** system. While the site itself is dedicated to Overwatch 2 management, the **authentication** logic (short-lived sessions, email verification, etc.) is **modular** enough for you to lift and integrate into your own Next.js applications.

**Key Highlights**:

- Tailored for Overwatch 2 team management but adaptable to any team-based or membership scenario.
- **Reusable** authentication layer that uses short-lived sessions, rate-limiting, and secure email verification.
- Offers advanced admin features like user role management, invite-only registration, session revocation, and more.

---

## Features

1. **Team Management**  
   - Create and maintain Overwatch 2 rosters, including roles (DPS, Tank, Support), coaches, and subs.
   - Admin dashboards to oversee player stats, replays, schedules, etc.

2. **Custom Auth System**  
   - Registration with optional invite-only workflow.
   - Passwords hashed via [bcrypt](https://github.com/kelektiv/node.bcrypt.js).
   - **Email verification** links and forced email validation.

3. **Sessions & CSRF**  
   - Short-lived **httpOnly** session cookies with **sliding expiration**.
   - Per-session CSRF token to thwart cross-site request forgery attacks.

4. **Rate Limiting**  
   - [Upstash Ratelimit](https://github.com/upstash/ratelimit-js) protects against brute-force login attempts.

5. **GeoIP & Analytics** *(Optional)*  
   - Integrates [MaxMind GeoIP2](https://github.com/maxmind/GeoIP2-node) for approximate user location.

6. **Email Services**  
   - Transactional emails managed by [Resend](https://resend.com).

---

## Tech Stack

- **Next.js 15+** (App Router)  
- **TypeScript**  
- **Prisma** + PostgreSQL  
- **Bcrypt** for password hashing  
- **Upstash** Redis & Ratelimit for login security  
- **GeoIP2** for optional location lookups  
- **Resend** for emails  
- **Tailwind CSS** for UI  
- **Zod** for schema validation  
- Deployed on **Vercel** or any Next.js-friendly platform

---

## Project Structure

Here's a quick look at the repo:

```bash
spectra-self-auth/
├── app/                    # Next.js App Router 
│   ├── (auth)/             # Auth pages (sign-in, sign-up, reset password, etc.)
│   ├── (home)/             # Public pages (news, roster, etc.)
│   ├── dashboard/          # Protected admin/team management
│   ├── api/                # Route handlers (e.g., /api/auth/login)
│   ├── middleware.ts       # Session & auth checks
│   └── ...
├── components/             # UI components (forms, nav, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities (prisma, redis, email, auth logic, etc.)
├── prisma/                 # Prisma schema & migrations
├── public/                 # Static assets
├── types/                  # TS type definitions
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## Getting Started

### Requirements

1. **Node.js 18+**  
2. **PostgreSQL** (local or hosted)  
3. **Upstash Redis** (optional but recommended for rate-limiting)

### 1. Clone the Repository

```bash
git clone https://github.com/Simon-Fontaine/spectra-self-auth.git
```

### 2. Install Dependencies

```bash
cd spectra-self-auth
npm install
# or yarn install / pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` (or use `.env.example` as reference):

```env
DATABASE_URL="your-postgres-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
JWT_SECRET="your-jwt-secret"
JWT_ISSUER="your-jwt-issuer"
JWT_AUDIENCE="your-jwt-audience"
RESEND_API_KEY="your-resend-api-key"
PULSE_API_KEY="(optional) for Prisma Pulse"
REGISTRATION_ENABLED=true
REGISTRATION_INVITE_ONLY=true
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore.

---

## Scripts

| Script             | Description                                           |
|--------------------|-------------------------------------------------------|
| **`npm run dev`**  | Starts the local dev server (with turbopack).         |
| **`npm run build`**| Builds production bundles for Next.js.               |
| **`npm run start`**| Runs the app in production mode.                      |
| **`npm run lint`** | Lints the code with Biome/ESLint.                     |

---

## Deployment

You can deploy this project to **Vercel** or any Next.js-supporting platform:

1. Ensure environment variables (in `.env.*`) are set in your host’s config.  
2. Run build scripts (`npm run build`) or rely on your host’s auto-build.  
3. Confirm your **database**, **redis** config, and **email** provider keys.  

Once deployed, your Overwatch 2 team management site, along with its robust custom authentication, is live.

---

## Authentication Flow

1. **Registration**  
   - Invite-based or open registration, depending on environment config.
   - User picks a unique username, email, and password.

2. **Email Verification**  
   - A verification link is sent to the user’s email.
   - Clicking it confirms the user’s email in the database.

3. **Login**  
   - On successful credential check, a short-lived session cookie + CSRF token is issued.

4. **Session Management**  
   - Sessions extend automatically if the user is active but expire after prolonged inactivity.
   - CSRF tokens protect state-changing requests.

5. **Logout**  
   - Session is invalidated server-side, and client cookies are cleared.

---

## Security Considerations

- **Password Hashing**: Uses bcrypt to hash passwords.  
- **HTTP-Only Cookies**: Session tokens are not accessible to JavaScript.  
- **CSRF Protection**: Each session has a unique CSRF secret validated on requests.  
- **Rate Limiting**: Helps thwart brute-force attempts on login endpoints.  
- **Sliding Expiration**: Sessions refresh on activity but eventually expire if idle.

---

## Contributing

Contributions are welcome! Please:

1. **Fork** the repository.  
2. **Create a branch** with your feature/fix.  
3. **Make changes** and commit.  
4. **Open a PR** to merge into `main`.

Thank you for helping improve **Spectra Self-Auth**!

---

## License

This project is licensed under the [MIT License](https://github.com/Simon-Fontaine/spectra-self-auth?tab=MIT-1-ov-file). Feel free to modify or adapt for commercial and personal use.

---

## Additional Resources

- [Upstash Ratelimit](https://github.com/upstash/ratelimit-js)  
- [Redis](https://github.com/upstash/redis-js)  
- [MaxMind GeoIP2](https://github.com/maxmind/GeoIP2-node)  
- [Vercel](https://vercel.com)  
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

Enjoy your **Overwatch 2** team management site with fully customizable authentication! If you run into any issues, feel free to open an [issue](https://github.com/Simon-Fontaine/spectra-self-auth/issues) or discussion.
