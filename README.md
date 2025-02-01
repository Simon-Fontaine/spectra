# Spectra Self-Auth

A Next.js application demonstrating custom authentication using sessions, CSRF protection, and email verification.

## Overview

Spectra Self-Auth is a full-stack authentication system built entirely within Next.js (15+). It facilitates user registration, login, session management, rate-limiting for login attempts, and email verification, ensuring a secure and seamless user experience.

## Features

- **Registration & Login**  
  Users can create accounts and log in. Passwords are securely hashed using [bcrypt](https://github.com/kelektiv/node.bcrypt.js).

- **Session Management**  
  Short-lived session tokens are stored in `httpOnly` cookies, providing secure session handling without the need for refresh tokens.

- **CSRF Protection**  
  A CSRF token is generated with each session to mitigate cross-site request forgery attacks.

- **Rate Limiting**  
[Upstash Ratelimit](https://github.com/upstash/ratelimit) limits the number of login attempts from the same IP address, enhancing security against brute-force attacks.

- **Email Verification**  
  Newly registered users receive an email with a verification link. Upon verification, the user’s email is marked as verified.

- **GeoIP Lookup**  
(Optional) Utilizes [MaxMind GeoIP2](https://github.com/maxmind/GeoIP2-node) to track approximate user location (city, country) in the session record.

## Tech Stack

- **Next.js 15+** (App Router)
- **TypeScript**
- **Prisma** with PostgreSQL
- **Bcrypt** for password hashing
- **[Upstash Ratelimit](https://github.com/upstash/ratelimit)** and **[Redis](https://github.com/upstash/redis)** for rate limiting
- **GeoIP2** for location lookups (optional)
- **Resend** for transactional emails

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Simon-Fontaine/spectra-self-auth.git
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary packages:

```bash
cd spectra-self-auth
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` or `.env.local` file in the project root and populate it with the following variables:

```env
DATABASE_URL="your-postgresql-connection-string"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-rest-token"
UPSTASH_REDIS_REST_URL="your-upstash-redis-rest-url"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-read-write-token"
JWT_SECRET="your-jwt-secret"
JWT_SISUER="your-jwt-issuer"
JWT_AUDIENCE="your-jwt-audience"
RESEND_API_KEY="your-resend-api-key"
PULSE_API_KEY="(optional) for Prisma Pulse"
```

**Note:** Replace the placeholder values with your actual configuration details.

### 4. Run Database Migrations

Apply the Prisma migrations to set up your database schema:

```bash
npx prisma migrate deploy
```

### 5. Start the Development Server

Launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Scripts

- **`npm run dev`**: Starts the local development server.
- **`npm run build`**: Builds the Next.js production bundles.
- **`npm run start`**: Runs the production build.
- **`npm run lint`**: Lints the codebase using ESLint.

## Deployment

Deploy Spectra Self-Auth on [Vercel](https://vercel.com) or any platform that supports Next.js 15+. Ensure all environment variables are correctly set in the hosting environment to match your `.env` configuration.

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the Repository**  
   Click the "Fork" button at the top-right corner of the repository page.

2. **Create a New Feature Branch**

   ```bash
   git checkout -b feature-name
   ```

3. **Make Your Changes and Commit**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature-name
   ```

5. **Open a Pull Request**  
   Navigate to the repository on GitHub and open a pull request from your feature branch.

## License

This project is licensed under the [MIT License](./LICENSE) &mdash; feel free to modify and use it for personal or commercial projects.

---

## Additional Resources

- [Upstash Ratelimit](https://github.com/upstash/ratelimit)
- [Redis](https://github.com/upstash/redis)
- [MaxMind GeoIP2](https://github.com/maxmind/GeoIP2-node)
- [Vercel](https://vercel.com)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

---

## Project Structure

Here's a brief overview of the project structure to help you navigate the codebase:

```bash
Directory structure:
└── simon-fontaine-spectra-self-auth/
    ├── README.md
    ├── LICENCE
    ├── components.json
    ├── eslint.config.mjs
    ├── middleware.ts
    ├── next.config.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.mjs
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── (auth)/
    │   │   ├── forgot-password/
    │   │   │   └── page.tsx
    │   │   ├── reset-password/
    │   │   │   └── page.tsx
    │   │   ├── sign-in/
    │   │   │   └── page.tsx
    │   │   └── sign-up/
    │   │       └── page.tsx
    │   ├── (home)/
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── api/
    │   │   └── auth/
    │   │       ├── account-deletion/
    │   │       │   ├── route.ts
    │   │       │   └── confirm/
    │   │       │       └── route.ts
    │   │       ├── email/
    │   │       │   ├── change/
    │   │       │   │   ├── route.ts
    │   │       │   │   └── confirm/
    │   │       │   │       └── route.ts
    │   │       │   └── verify/
    │   │       │       └── route.ts
    │   │       ├── login/
    │   │       │   └── route.ts
    │   │       ├── logout/
    │   │       │   └── route.ts
    │   │       ├── password/
    │   │       │   ├── forgot/
    │   │       │   │   └── route.ts
    │   │       │   └── reset/
    │   │       │       └── route.ts
    │   │       ├── register/
    │   │       │   └── route.ts
    │   │       └── session/
    │   │           └── route.ts
    │   └── dashboard/
    │       └── page.tsx
    ├── components/
    │   ├── announcement.tsx
    │   ├── loading-button.tsx
    │   ├── page-header.tsx
    │   ├── theme-switcher.tsx
    │   ├── forms/
    │   │   ├── forgotpassword-form.tsx
    │   │   ├── resetpassword-form.tsx
    │   │   ├── signin-form.tsx
    │   │   └── signup-form.tsx
    │   ├── layouts/
    │   │   ├── app-footer.tsx
    │   │   ├── app-header.tsx
    │   │   ├── auth-button.tsx
    │   │   ├── user-menu.tsx
    │   │   └── navigation/
    │   │       ├── app-desktop-nav.tsx
    │   │       └── app-mobile-nav.tsx
    │   └── ui/
    │       ├── alert-dialog.tsx
    │       ├── alert.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── card.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── pagination.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── sonner.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       └── tooltip.tsx
    ├── hooks/
    │   ├── use-mobile.tsx
    │   ├── use-toast.ts
    │   └── useSession.ts
    ├── lib/
    │   ├── config.tsx
    │   ├── dbEdge.ts
    │   ├── dbRealtime.ts
    │   ├── redis.ts
    │   ├── utils.ts
    │   ├── zod.ts
    │   ├── auth/
    │   │   ├── get-session.ts
    │   │   ├── jwt.ts
    │   │   ├── session.ts
    │   │   ├── user.ts
    │   │   └── verification.ts
    │   ├── email/
    │   │   └── resend.ts
    │   └── utils/
    │       ├── hash.ts
    │       └── requestDetails.ts
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    │       ├── migration_lock.toml
    │       ├── 20250130170851_init/
    │       │   └── migration.sql
    │       ├── 20250130171241_unique_verification_tokens/
    │       │   └── migration.sql
    │       └── 20250130171355_unique_verification_new_email/
    │           └── migration.sql
    ├── providers/
    │   └── theme-provider.tsx
    ├── public/
    │   └── images/
    └── types/
        └── models.ts
```

### Key Directories and Files

- **`app/`**: Contains the main application pages and API routes.
- **`components/`**: Reusable React components.
- **`hooks/`**: Custom React hooks.
- **`lib/`**: Utility functions, configuration, and library integrations.
- **`prisma/`**: Prisma schema and migration files.
- **`types/`**: TypeScript type definitions.

## Authentication Flow

1. **Registration**
   - Users register by providing a username, email, and password.
   - Upon successful registration, an email verification link is sent to the user's email address.

2. **Email Verification**
   - Users verify their email by clicking the verification link.
   - This action marks the user's email as verified in the database.

3. **Login**
   - Users log in using their username/email and password.
   - Upon successful authentication, a session token is created and stored in an `httpOnly` cookie.

4. **Session Management**
   - Sessions are managed using short-lived tokens with sliding expiration.
   - CSRF tokens are generated and validated for state-changing requests.

5. **Logout**
   - Users can log out, which invalidates their session and clears relevant cookies.

## Security Considerations

- **Password Hashing**: Passwords are hashed using bcrypt before storage.
- **HTTP-Only Cookies**: Session tokens are stored in `httpOnly` cookies to prevent access via JavaScript.
- **CSRF Protection**: CSRF tokens are implemented to protect against cross-site request forgery.
- **Rate Limiting**: Login attempts are rate-limited to mitigate brute-force attacks.
- **Email Verification**: Ensures that users verify their email addresses before gaining full access.
