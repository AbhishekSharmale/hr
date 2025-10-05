# HR SaaS Platform - Technical Specification

## Core Modules

### 1. Employee Directory
- Central profile system with basic info, work details, documents
- Role-based permissions (Admin/Manager/Employee)
- Search, filter, and profile management

### 2. Onboarding Module
- Template-based checklist system
- Task assignment with due dates
- Progress tracking and automation
- Document upload and verification

### 3. Offboarding Module
- Exit workflow management
- Asset collection tracking
- Knowledge transfer coordination
- Final settlement processing

### 4. Leave & Attendance
- Leave request/approval workflow
- Balance tracking by leave type
- Calendar view for team visibility
- Simple attendance logging

### 5. Applicant Tracking System
- Job posting management
- Candidate pipeline (Kanban)
- Interview scheduling
- Hiring workflow integration

### 6. Notifications & Automation
- Email and in-app notifications
- Workflow triggers and reminders
- User preference management

## Database Schema Overview

### Core Tables
- `companies` - Multi-tenant isolation
- `users` - Authentication and roles
- `employees` - Main employee profiles
- `onboarding_checklists` - Workflow management
- `leave_requests` - Time-off tracking
- `candidates` - ATS pipeline
- `notifications` - Communication system

## Security & Compliance
- Multi-tenant data isolation
- Document encryption at rest
- HTTPS enforcement
- Rate limiting and audit logs

## Deployment Architecture
- Frontend: Vercel/Railway
- Backend: Render/Railway
- Database: PostgreSQL (managed)
- Storage: AWS S3/Cloudflare R2
- Email: Resend/SendGrid
- Payments: Razorpay