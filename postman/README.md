# SynergySphere API - Postman Collection

This folder contains the Postman collection for testing the SynergySphere API.

## Files

- **`SynergySphere_API.postman_collection.json`** - Complete Postman collection with all API endpoints
- **`API_Documentation.md`** - Detailed API documentation with request/response examples

## Quick Start

### 1. Import the Collection

1. Open Postman
2. Click "Import" in the top left
3. Select `SynergySphere_API.postman_collection.json`
4. The collection will be imported with all folders and requests

### 2. Configure Environment Variables

The collection uses the following variables:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `baseUrl` | API base URL | `http://localhost:3001/api` |
| `authToken` | JWT authentication token | (empty) |
| `projectId` | Project ID for testing | (empty) |
| `taskId` | Task ID for testing | (empty) |

**To set variables:**
1. Click the gear icon (⚙️) in the top right
2. Select "Environments"
3. Create a new environment (e.g., "Development")
4. Add the variables with their values
5. Select the environment from the dropdown

### 3. Authenticate

1. Run the **Register User** request in the Auth folder
2. Copy the `token` from the response
3. Update the `authToken` variable in your environment
4. Or run the **Login** request - it automatically sets the token via test script

### 4. Test the API

Now you can test all authenticated endpoints. The collection is organized into folders:

- **Auth** - User authentication and profile management
- **Projects** - Project CRUD operations
- **Tasks** - Task management
- **Members** - Team member management
- **Discussions** - Project discussions/messaging
- **Notifications** - User notifications
- **Dashboard** - Dashboard statistics and analytics
- **Health Check** - Server health status

## Collection Features

### Auto-Authentication

The **Login** request includes a test script that automatically sets the `authToken` variable:

```javascript
var jsonData = pm.response.json();
if (jsonData.success && jsonData.data.token) {
  pm.collectionVariables.set("authToken", jsonData.data.token);
}
```

After running Login, all subsequent requests will use the new token automatically.

### Bearer Token Authentication

The collection is configured to use Bearer token authentication. All requests (except Register and Login) will automatically include:

```
Authorization: Bearer {{authToken}}
```

### Dynamic Variables

Use variables in your requests for dynamic values:
- `{{baseUrl}}` - API base URL
- `{{authToken}}` - JWT token
- `{{projectId}}` - Current project ID
- `{{taskId}}` - Current task ID

## Testing Workflow

### Recommended Testing Order

1. **Register User** - Create a test account
2. **Login** - Authenticate and get token
3. **Create Project** - Create a test project
4. **Update Project ID Variable** - Set `projectId` from response
5. **Create Task** - Create a test task
6. **Update Task ID Variable** - Set `taskId` from response
7. **Test Other Endpoints** - Explore the full API

### Example Workflow

```bash
# 1. Register
POST /auth/register
{
  "fullName": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# 2. Login (auto-sets token)
POST /auth/login
{
  "email": "test@example.com",
  "password": "password123"
}

# 3. Create Project
POST /projects
{
  "name": "Test Project",
  "description": "Testing API",
  "priority": "medium"
}

# 4. Copy project ID and set projectId variable

# 5. Create Task
POST /tasks
{
  "projectId": "{{projectId}}",
  "title": "Test Task",
  "priority": "medium"
}

# 6. Copy task ID and set taskId variable

# 7. Test other endpoints
GET /tasks
GET /projects/{{projectId}}
PATCH /tasks/{{taskId}}/status
```

## Environment Setup

### Development Environment

```json
{
  "baseUrl": "http://localhost:3001/api",
  "authToken": "",
  "projectId": "",
  "taskId": ""
}
```

### Production Environment

```json
{
  "baseUrl": "/api",
  "authToken": "",
  "projectId": "",
  "taskId": ""
}
```

## API Endpoints Summary

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `POST /auth/avatar` - Upload avatar

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get single project
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get single task
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `PATCH /tasks/:id/status` - Update task status
- `DELETE /tasks/:id` - Delete task

### Members
- `GET /members` - Get all members
- `POST /members/invite` - Invite member
- `PUT /members/:id/role` - Update member role
- `DELETE /members/:id` - Remove member

### Discussions
- `GET /discussions/:projectId` - Get project discussions
- `POST /discussions` - Send message
- `DELETE /discussions/:id` - Delete message

### Notifications
- `GET /notifications` - Get all notifications
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

### Dashboard
- `GET /dashboard/stats` - Get dashboard stats
- `GET /dashboard/weekly-activity` - Get weekly activity
- `GET /dashboard/activities` - Get recent activities

### Health
- `GET /health` - Health check

## Common Issues

### 401 Unauthorized
- Make sure you have a valid `authToken` set
- Try logging in again to get a fresh token

### 403 Forbidden
- Check if you have the required permissions (manager role for some operations)
- Ensure you're a member of the project

### 404 Not Found
- Verify the ID in your variables is correct
- Check if the resource exists

### Connection Refused
- Ensure the server is running on the correct port
- Check your `baseUrl` variable matches your server configuration

## Advanced Usage

### Running Collections

You can run the entire collection or specific folders using Postman's Collection Runner:

1. Select the collection or folder
2. Click "Run" (▶️) in the top right
3. Configure iteration count and delay
4. Run and view results

### Writing Tests

Add tests to requests to validate responses:

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has data", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData.success).to.be.true;
});
```

### Pre-request Scripts

Add pre-request scripts to modify requests before sending:

```javascript
// Generate timestamp
pm.environment.set("timestamp", Date.now());
```

## Documentation

For detailed API documentation with request/response examples, see `API_Documentation.md`.

## Support

For issues or questions:
1. Check the API documentation
2. Verify your environment variables
3. Ensure the server is running
4. Check the server logs for errors

## License

This collection is part of the SynergySphere project.
