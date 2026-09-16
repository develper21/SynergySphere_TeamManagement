import { useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tasks: true,
    projects: true,
  });
  const [language, setLanguage] = useState("en");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="clay-card p-6 max-w-2xl space-y-8">
        {/* Appearance */}
        <div>
          <h2 className="text-xl font-bold mb-4">Appearance</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  darkMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Email Notifications</span>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.email ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Push Notifications</span>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.push ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.push ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Task Reminders</span>
              <button
                onClick={() => setNotifications({ ...notifications, tasks: !notifications.tasks })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.tasks ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.tasks ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Project Updates</span>
              <button
                onClick={() => setNotifications({ ...notifications, projects: !notifications.projects })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.projects ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications.projects ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div>
          <h2 className="text-xl font-bold mb-4">Language</h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="clay-input w-full px-4 py-3 text-sm font-medium outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-xl font-bold mb-4">Security</h2>
          <button className="clay-button bg-muted text-foreground px-4 py-2 font-bold">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
