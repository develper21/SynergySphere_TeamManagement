import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:3001/api");

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "archived";
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  members?: number;
  tasks?: {
    total: number;
    done: number;
  };
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    name: string;
  };
  assignee?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Member {
  id: string;
  projectId: string;
  userId: string;
  role: "manager" | "member";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  project?: {
    id: string;
    name: string;
  };
  tasks?: number;
  status?: "active" | "pending";
}

export interface Discussion {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  type: "invite" | "task" | "message" | "update";
  title: string;
  description: string;
  read: boolean;
  actionable?: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  user: string;
  project: string;
  action: string;
  task: string;
  time: string;
}

export interface DashboardStats {
  activeProjects: number;
  tasksCompleted: number;
  teamMembers: number;
  productivity: number;
}
