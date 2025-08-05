import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/axios';
import { apiPaths } from '../../utils/apiPaths';

function ViewTaskDetails() {
    const { user } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchTaskDetails();
    }, [id]);

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(apiPaths.TASKS.GET_TASK_BY_ID.replace(':id', id));
            setTask(response.data.data);
        } catch (error) {
            console.error('Error fetching task details:', error);
            setError('Failed to load task details');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            setUpdating(true);
            await api.put(apiPaths.TASKS.UPDATE_TASK_STATUS.replace(':id', id), {
                status: newStatus
            });
            fetchTaskDetails(); // Refresh the task data
        } catch (error) {
            console.error('Error updating task status:', error);
            setError('Failed to update task status');
        } finally {
            setUpdating(false);
        }
    };

    const handleChecklistUpdate = async (todoCheckList) => {
        try {
            setUpdating(true);
            await api.put(apiPaths.TASKS.UPDATE_TASK_CHECKLIST.replace(':id', id), {
                todoCheckList
            });
            fetchTaskDetails(); // Refresh the task data
        } catch (error) {
            console.error('Error updating checklist:', error);
            setError('Failed to update checklist');
        } finally {
            setUpdating(false);
        }
    };

    const handleTodoToggle = async (todoIndex, isCompleted) => {
        if (!task) return;

        const updatedTodoCheckList = [...task.todoCheckList];
        updatedTodoCheckList[todoIndex] = {
            ...updatedTodoCheckList[todoIndex],
            isCompleted
        };

        await handleChecklistUpdate(updatedTodoCheckList);
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
                    <p className="text-gray-600">You need to be logged in to view task details.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading task details...</p>
                </div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
                    <p className="text-gray-600">{error || 'Task not found'}</p>
                    <Link
                        to="/user/my-tasks"
                        className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to My Tasks
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                to="/user/my-tasks"
                                className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
                            >
                                ← Back to My Tasks
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                            <div className="flex items-center space-x-3">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                                    {task.priority} Priority
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                {isOverdue(task.dueDate) && task.status !== 'Completed' && (
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                        Overdue
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 leading-relaxed">{task.description}</p>
                        </div>

                        {/* Checklist */}
                        {task.todoCheckList && task.todoCheckList.length > 0 && (
                            <div className="bg-white rounded-lg shadow p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Checklist</h2>
                                    <div className="text-sm text-gray-500">
                                        {task.todoCheckList.filter(todo => todo.isCompleted).length} of {task.todoCheckList.length} completed
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {task.todoCheckList.map((todo, index) => (
                                        <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={todo.isCompleted}
                                                onChange={(e) => handleTodoToggle(index, e.target.checked)}
                                                disabled={updating}
                                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <span className={`ml-3 flex-1 ${todo.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                                {todo.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Progress */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Progress</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Task Completion</span>
                                        <span>{task.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                            style={{ width: `${task.progress || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Task Info */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                                    <p className={`text-sm ${isOverdue(task.dueDate) && task.status !== 'Completed' ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                        {formatDate(task.dueDate)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Created</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(task.createdAt)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Updated</p>
                                    <p className="text-sm text-gray-900">
                                        {formatDate(task.updatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
                            <div className="space-y-3">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={updating}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                {updating && (
                                    <p className="text-sm text-gray-500">Updating...</p>
                                )}
                            </div>
                        </div>

                        {/* Assigned To */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned To</h3>
                            <div className="flex items-center">
                                {task.assignedTo?.profileImageUrl && (
                                    <img
                                        className="h-12 w-12 rounded-full mr-4"
                                        src={task.assignedTo.profileImageUrl}
                                        alt={task.assignedTo.name}
                                    />
                                )}
                                <div>
                                    <p className="font-medium text-gray-900">{task.assignedTo?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{task.assignedTo?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewTaskDetails;