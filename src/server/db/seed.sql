-- Clear existing data
TRUNCATE TABLE activities, notifications, discussions, tasks, project_members, projects, users CASCADE;

-- Create users
INSERT INTO users (id, email, password_hash, name, role, avatar_url, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@synergysphere.com', 'admin123', 'Admin User', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'manager@synergysphere.com', 'manager123', 'Project Manager', 'manager', 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'member1@synergysphere.com', 'member123', 'Team Member 1', 'member', 'https://api.dicebear.com/7.x/avataaars/svg?seed=member1', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440004', 'member2@synergysphere.com', 'member123', 'Team Member 2', 'member', 'https://api.dicebear.com/7.x/avataaars/svg?seed=member2', NOW(), NOW());

-- Create projects
INSERT INTO projects (id, name, description, priority, status, due_date, created_by, created_at, updated_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete overhaul of the company website with modern design', 'high', 'active', '2024-12-31', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Develop a cross-platform mobile application', 'medium', 'active', '2025-03-31', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('660e8400-e29b-41d4-a716-446655440003', 'Database Migration', 'Migrate legacy database to new infrastructure', 'low', 'completed', '2024-06-30', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Add project members
INSERT INTO project_members (id, project_id, user_id, role, joined_at) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'manager', NOW()),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW()),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member', NOW()),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'manager', NOW()),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member', NOW()),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'manager', NOW()),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'member', NOW());

-- Create tasks
INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, created_by, created_at, updated_at) VALUES
  ('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Design homepage mockup', 'Create initial design concepts for the homepage', 'done', 'high', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Implement responsive layout', 'Make the website fully responsive across devices', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Add contact form', 'Implement contact form with validation', 'todo', 'medium', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'Setup React Native project', 'Initialize React Native project structure', 'done', 'high', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Implement authentication', 'Add user authentication flow', 'in-progress', 'high', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()),
  ('880e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', 'Backup existing database', 'Create full backup of legacy database', 'done', 'high', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW());

-- Create discussions
INSERT INTO discussions (id, project_id, user_id, content, created_at) VALUES
  ('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Let''s schedule a meeting to discuss the design direction for the homepage.', NOW()),
  ('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'I''ve uploaded the initial mockups to the shared folder. Please review.', NOW()),
  ('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'We need to decide on the authentication provider.', NOW()),
  ('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'I recommend using Firebase Auth for simplicity.', NOW());

-- Create notifications
INSERT INTO notifications (id, user_id, type, title, description, read, actionable, related_id, created_at) VALUES
  ('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'task', 'New task assigned', 'You have been assigned to ''Implement responsive layout''', false, true, '880e8400-e29b-41d4-a716-446655440002', NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'invite', 'Project invitation', 'You have been invited to join ''Website Redesign''', true, true, '660e8400-e29b-41d4-a716-446655440001', NOW()),
  ('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'message', 'New discussion', 'New comment in ''Website Redesign'' project', false, false, '660e8400-e29b-41d4-a716-446655440001', NOW());

-- Create activities
INSERT INTO activities (id, user_id, project_id, action, entity_type, entity_id, metadata, created_at) VALUES
  ('bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'created_project', 'project', '660e8400-e29b-41d4-a716-446655440001', '{"projectName": "Website Redesign"}', NOW()),
  ('bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'completed_task', 'task', '880e8400-e29b-41d4-a716-446655440001', '{"taskTitle": "Design homepage mockup"}', NOW()),
  ('bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'created_project', 'project', '660e8400-e29b-41d4-a716-446655440002', '{"projectName": "Mobile App Development"}', NOW()),
  ('bb0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'started_task', 'task', '880e8400-e29b-41d4-a716-446655440005', '{"taskTitle": "Implement authentication"}', NOW());
