-- HR SaaS Platform Database Schema

-- Companies (Multi-tenant)
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    industry VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'employee')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees (Main Entity)
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    employee_id VARCHAR(50),
    department VARCHAR(100),
    designation VARCHAR(100),
    manager_id INTEGER REFERENCES employees(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'notice', 'exited')),
    onboarding_status VARCHAR(40) DEFAULT 'awaiting_it',
    company_email VARCHAR(255),
    buddy_id INTEGER REFERENCES employees(id),
    date_of_joining DATE,
    date_of_exit DATE,
    profile_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    document_type VARCHAR(100),
    file_name VARCHAR(255),
    file_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding Templates
CREATE TABLE onboarding_templates (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT false
);

-- Onboarding Task Templates
CREATE TABLE onboarding_tasks_template (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES onboarding_templates(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50),
    assignee_role VARCHAR(20),
    due_day_offset INTEGER
);

-- Leave Types
CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    name VARCHAR(100) NOT NULL,
    annual_quota INTEGER,
    color VARCHAR(7)
);

-- Leave Requests
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    leave_type_id INTEGER REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(3,1),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by INTEGER REFERENCES employees(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Postings
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    job_posting_id INTEGER REFERENCES job_postings(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    resume_url TEXT,
    cover_letter TEXT,
    stage VARCHAR(50) DEFAULT 'applied',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(50),
    title VARCHAR(255),
    message TEXT,
    link TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Notifications
CREATE TABLE employee_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id INTEGER REFERENCES employees(id),
    type VARCHAR(30),
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Tasks
CREATE TABLE employee_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id INTEGER REFERENCES employees(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
    link TEXT,
    task_type VARCHAR(30) DEFAULT 'general',
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Employee Goals
CREATE TABLE employee_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id INTEGER REFERENCES employees(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_date DATE,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'overdue')),
    created_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Manager Reviews
CREATE TABLE manager_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id INTEGER REFERENCES employees(id),
    manager_id INTEGER REFERENCES employees(id),
    review_type VARCHAR(30) DEFAULT 'onboarding_completion',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rework')),
    notes TEXT,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Log (Enhanced)
CREATE TABLE activity_log (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    actor_id INTEGER REFERENCES users(id),
    role VARCHAR(20),
    action VARCHAR(50),
    description TEXT,
    metadata JSONB,
    device_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding Events (Audit Trail)
CREATE TABLE onboarding_events (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    actor_id INTEGER REFERENCES users(id),
    role VARCHAR(20),
    event_type VARCHAR(40),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_candidates_job_posting_id ON candidates(job_posting_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_employee_notifications_employee_id ON employee_notifications(employee_id);
CREATE INDEX idx_employee_tasks_employee_id ON employee_tasks(employee_id);
CREATE INDEX idx_employee_goals_employee_id ON employee_goals(employee_id);
CREATE INDEX idx_manager_reviews_employee_id ON manager_reviews(employee_id);
CREATE INDEX idx_manager_reviews_manager_id ON manager_reviews(manager_id);
CREATE INDEX idx_activity_log_employee_id ON activity_log(employee_id);
CREATE INDEX idx_onboarding_events_employee_id ON onboarding_events(employee_id);