# Plan Tip Invest

## 1. General

### Rules and Guidelines
- Maintain a clean and modular codebase.
- Follow best practices for security, performance, and scalability.
- Use version control (Git) with meaningful commit messages.
- Keep documentation updated and comprehensive.
- Prioritize type safety and code readability.
- Use a consistent naming convention for all elements.
- Ensure code is tested before deployment.

## 2. Structure

### Database Schema

#### Initial Schema:

**USER Table**
- `id` (UUID, Primary Key, Auto-generated)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password_hash` (TEXT, NOT NULL)
- `role` (ENUM: [user, admin], DEFAULT 'user')
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

**REALESTATE Table**
- `id` (UUID, Primary Key, Auto-generated)
- `owner_id` (UUID, Foreign Key -> USER(id), NOT NULL)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT, NOT NULL)
- `details` (JSON, NOT NULL)
- `status` (ENUM: [available, sold], DEFAULT 'available')
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)

**TRANSACTIONS Table**
- `id` (UUID, Primary Key, Auto-generated)
- `user_id` (UUID, Foreign Key -> USER(id), NOT NULL)
- `action` (TEXT, NOT NULL)
- `amount` (DECIMAL, NULLABLE for consultation actions)
- `transaction_date` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

## 3. Standards

### Coding Standards

#### TypeScript for Everything
- **Functions Naming:**
    - `MakeSomething()`: ✅ (Correct)
    - `makeSomething()`: ❌ (Incorrect)
    - `make_something()`: ❌ (Incorrect)
- **Variables Naming:**
    - `let MyVar`: ✅ (Correct)
    - `let My_var`: ❌ (Incorrect)
    - `let my_var`: ❌ (Incorrect)
- **Private Variables:**
    - `_MyPrivateVariable`: ✅ (Correct)

### Code Practices
- Use consistent indentation and spacing.
- Avoid using `any` in TypeScript.
- Always use `const` and `let` instead of `var`.
- Write self-documenting code; minimize the need for excessive comments.
- Prefer immutable data structures where applicable.

## 4. Tech Stack

### Frontend
- **Runtime**: Node.js or Bun
- **Frameworks**: React Native (for mobile) + React (for web)
- **State Management**: Redux

### Backend
- **Framework**: Hono (for performance and scalability)
- **Runtime**: Bun

### Database
- **Primary Database**: PostgreSQL
- **ORM/Query Builder**: To be determined (Prisma, Drizzle, or similar)

### Deployment
- **Hosting**: DigitalOcean

## 5. Running the Project

Make sure u are at the root of the diractory

1. Start the Backend server ```cd Backend``` then ```bun dev``` or ```npm run dev```