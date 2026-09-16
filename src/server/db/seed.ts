import { db } from "./index";
import { users, projects, projectMembers, tasks, discussions, notifications, activities } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await db.delete(activities);
  await db.delete(notifications);
  await db.delete(discussions);
  await db.delete(tasks);
  await db.delete(projectMembers);
  await db.delete(projects);
  await db.delete(users);

  // Create users
  const [user1] = await db.insert(users).values([
    {
      email: "admin@synergysphere.com",
      passwordHash: "admin123",
      name: "Admin User",
      role: "admin",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  ]).returning();

  const [user2] = await db.insert(users).values([
    {
      email: "manager@synergysphere.com",
      passwordHash: "manager123",
      name: "Project Manager",
      role: "manager",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
    },
  ]).returning();

  const [user3] = await db.insert(users).values([
    {
      email: "member1@synergysphere.com",
      passwordHash: "member123",
      name: "Team Member 1",
      role: "member",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member1",
    },
  ]).returning();

  const [user4] = await db.insert(users).values([
    {
      email: "member2@synergysphere.com",
      passwordHash: "member123",
      name: "Team Member 2",
      role: "member",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=member2",
    },
  ]).returning();

  // Create projects
  const [project1] = await db.insert(projects).values([
    {
      name: "Website Redesign",
      description: "Complete overhaul of the company website with modern design",
      priority: "high",
      status: "active",
      dueDate: new Date("2024-12-31"),
      createdBy: user2.id,
    },
  ]).returning();

  const [project2] = await db.insert(projects).values([
    {
      name: "Mobile App Development",
      description: "Develop a cross-platform mobile application",
      priority: "medium",
      status: "active",
      dueDate: new Date("2025-03-31"),
      createdBy: user2.id,
    },
  ]).returning();

  const [project3] = await db.insert(projects).values([
    {
      name: "Database Migration",
      description: "Migrate legacy database to new infrastructure",
      priority: "low",
      status: "completed",
      dueDate: new Date("2024-06-30"),
      createdBy: user1.id,
    },
  ]).returning();

  // Add project members
  await db.insert(projectMembers).values([
    { projectId: project1.id, userId: user2.id, role: "manager" },
    { projectId: project1.id, userId: user3.id, role: "member" },
    { projectId: project1.id, userId: user4.id, role: "member" },
    { projectId: project2.id, userId: user2.id, role: "manager" },
    { projectId: project2.id, userId: user3.id, role: "member" },
    { projectId: project3.id, userId: user1.id, role: "manager" },
    { projectId: project3.id, userId: user4.id, role: "member" },
  ]);

  // Create tasks
  const [task1] = await db.insert(tasks).values([
    {
      projectId: project1.id,
      title: "Design homepage mockup",
      description: "Create initial design concepts for the homepage",
      status: "done",
      priority: "high",
      assigneeId: user3.id,
      createdBy: user2.id,
    },
  ]).returning();

  const [task2] = await db.insert(tasks).values([
    {
      projectId: project1.id,
      title: "Implement responsive layout",
      description: "Make the website fully responsive across devices",
      status: "in-progress",
      priority: "high",
      assigneeId: user4.id,
      createdBy: user2.id,
    },
  ]).returning();

  const [task3] = await db.insert(tasks).values([
    {
      projectId: project1.id,
      title: "Add contact form",
      description: "Implement contact form with validation",
      status: "todo",
      priority: "medium",
      assigneeId: user3.id,
      createdBy: user2.id,
    },
  ]).returning();

  const [task4] = await db.insert(tasks).values([
    {
      projectId: project2.id,
      title: "Setup React Native project",
      description: "Initialize React Native project structure",
      status: "done",
      priority: "high",
      assigneeId: user3.id,
      createdBy: user2.id,
    },
  ]).returning();

  const [task5] = await db.insert(tasks).values([
    {
      projectId: project2.id,
      title: "Implement authentication",
      description: "Add user authentication flow",
      status: "in-progress",
      priority: "high",
      assigneeId: user3.id,
      createdBy: user2.id,
    },
  ]).returning();

  const [task6] = await db.insert(tasks).values([
    {
      projectId: project3.id,
      title: "Backup existing database",
      description: "Create full backup of legacy database",
      status: "done",
      priority: "high",
      assigneeId: user4.id,
      createdBy: user1.id,
    },
  ]).returning();

  // Create discussions
  await db.insert(discussions).values([
    {
      projectId: project1.id,
      userId: user2.id,
      content: "Let's schedule a meeting to discuss the design direction for the homepage.",
    },
    {
      projectId: project1.id,
      userId: user3.id,
      content: "I've uploaded the initial mockups to the shared folder. Please review.",
    },
    {
      projectId: project2.id,
      userId: user2.id,
      content: "We need to decide on the authentication provider.",
    },
    {
      projectId: project2.id,
      userId: user3.id,
      content: "I recommend using Firebase Auth for simplicity.",
    },
  ]);

  // Create notifications
  await db.insert(notifications).values([
    {
      userId: user3.id,
      type: "task",
      title: "New task assigned",
      description: "You have been assigned to 'Implement responsive layout'",
      read: false,
      actionable: true,
      relatedId: task2.id,
    },
    {
      userId: user4.id,
      type: "invite",
      title: "Project invitation",
      description: "You have been invited to join 'Website Redesign'",
      read: true,
      actionable: true,
      relatedId: project1.id,
    },
    {
      userId: user3.id,
      type: "message",
      title: "New discussion",
      description: "New comment in 'Website Redesign' project",
      read: false,
      actionable: false,
      relatedId: project1.id,
    },
  ]);

  // Create activities
  await db.insert(activities).values([
    {
      userId: user2.id,
      projectId: project1.id,
      action: "created_project",
      entityType: "project",
      entityId: project1.id,
      metadata: JSON.stringify({ projectName: "Website Redesign" }),
    },
    {
      userId: user3.id,
      projectId: project1.id,
      action: "completed_task",
      entityType: "task",
      entityId: task1.id,
      metadata: JSON.stringify({ taskTitle: "Design homepage mockup" }),
    },
    {
      userId: user2.id,
      projectId: project2.id,
      action: "created_project",
      entityType: "project",
      entityId: project2.id,
      metadata: JSON.stringify({ projectName: "Mobile App Development" }),
    },
    {
      userId: user3.id,
      projectId: project2.id,
      action: "started_task",
      entityType: "task",
      entityId: task5.id,
      metadata: JSON.stringify({ taskTitle: "Implement authentication" }),
    },
  ]);

  console.log("✅ Database seeded successfully!");
  console.log("📊 Summary:");
  console.log(`   - Users: 4`);
  console.log(`   - Projects: 3`);
  console.log(`   - Tasks: 6`);
  console.log(`   - Discussions: 4`);
  console.log(`   - Notifications: 3`);
  console.log(`   - Activities: 4`);
}

seed().catch(console.error);
