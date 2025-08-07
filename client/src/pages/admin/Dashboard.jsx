import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/axios';
import { apiPaths } from '../../utils/apiPaths';

function Dashboard() {
    const { user } = useContext(UserContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await api.get(apiPaths.TASKS.GET_DASHBOARD_TASKS);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'Low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!user || user.role !== 'Admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-white">Welcome back, <span className="text-blue-600">{user.name}</span>! Here's an overview of your task management system.</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-100 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {dashboardData?.statistics?.allTasks || 0}
                                </span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {dashboardData?.statistics?.allTasks || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-yellow-100 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {dashboardData?.statistics?.pendingTasks || 0}
                                </span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {dashboardData?.statistics?.pendingTasks || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-green-100 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {dashboardData?.statistics?.completedTasks || 0}
                                </span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Completed</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {dashboardData?.statistics?.completedTasks || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-red-100 rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">
                                    {dashboardData?.statistics?.overdueTasks || 0}
                                </span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Overdue</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {dashboardData?.statistics?.overdueTasks || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Task Distribution Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Distribution</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-800">Pending</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-red-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskDistribution?.pending || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskDistribution?.pending || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-800">In Progress</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskDistribution?.in_progress || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskDistribution?.in_progress || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">Completed</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskDistribution?.completed || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskDistribution?.completed || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Priority Distribution Chart */}
                    <div className="bg-purple-100 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-red-800">High Priority</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-red-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-red-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskPriorityLevels?.high || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskPriorityLevels?.high || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-yellow-500">Medium Priority</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-yellow-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-yellow-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskPriorityLevels?.medium || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskPriorityLevels?.medium || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-800">Low Priority</span>
                                <div className="flex items-center">
                                    <div className="w-32 bg-green-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ 
                                                width: `${dashboardData?.charts?.taskPriorityLevels?.low || 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        {dashboardData?.charts?.taskPriorityLevels?.low || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Tasks */}
                <div className="bg-yellow-100 rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                            <Link
                                to="/admin/manage-tasks"
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                View All Tasks →
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 bg-gray-100">
                        {dashboardData?.recentTasks?.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <p className="text-gray-500">No recent tasks found.</p>
                            </div>
                        ) : (
                            dashboardData?.recentTasks?.map((task) => (
                                <div key={task._id} className="px-6 py-4 hover:bg-gray-50 shadow-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    {task.title}
                                                </h4>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Due: {formatDate(task.dueDate)}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/admin/task/${task._id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-green-100 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link
                            to="/admin/create-task"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">+</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Create New Task</h4>
                                <p className="text-sm text-gray-500">Assign tasks to team members</p>
                            </div>
                        </Link>
                        <Link
                            to="/admin/manage-tasks"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">📋</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Manage Tasks</h4>
                                <p className="text-sm text-gray-500">View and manage all tasks</p>
                            </div>
                        </Link>
                        <Link
                            to="/admin/manage-users"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">👥</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Manage Users</h4>
                                <p className="text-sm text-gray-500">View team members</p>
                            </div>
                        </Link>
                        <Link
                            to="/admin/reports"
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold">📊</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">Generate Reports</h4>
                                <p className="text-sm text-gray-500">Export task and user data</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 