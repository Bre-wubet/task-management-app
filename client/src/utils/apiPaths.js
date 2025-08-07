export const BASE_URL = 'http://localhost:3001';

export const apiPaths = {
    AUTH: {
    signup: '/api/auth/register',
    login: '/api/auth/login',
    GET_USER_PROFILE: '/api/auth/profile',
    UPDATE_USER_PROFILE: '/api/auth/profile/:id',
    },
    USERS: {
        GET_ALL_USERS: '/api/users',
        GET_USER_BY_ID: '/api/users/:id',
        DELETE_USER: '/api/users/:id',
    }, 
    TASKS: {
        GET_DASHBOARD_TASKS: '/api/tasks/dashboard-tasks',
        GET_USER_DASHBOARD_TASKS: '/api/tasks/user-dashboard-tasks',
        GET_ALL_TASKS: '/api/tasks',
        GET_TASK_BY_ID: '/api/tasks/:id',
        CREATE_TASK: '/api/tasks',
        UPDATE_TASK: '/api/tasks/:id',
        DELETE_TASK: '/api/tasks/:id',
        UPDATE_TASK_STATUS: '/api/tasks/:id/status',
        UPDATE_TASK_CHECKLIST: '/api/tasks/:id/todo',
    },
    REPORTS: {
        Export_TASKS_REPORT: '/api/reports/export-tasks',
        Export_USERS_REPORT: '/api/reports/export-users',
    },
    UPLOADS: {
        UPLOAD_IMAGE: '/api/auth/upload-image',
    }
}