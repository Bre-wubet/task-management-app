import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import api from '../../utils/axios';
import { apiPaths } from '../../utils/apiPaths';

function CreateTask() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [users, setUsers] = useState([]);
    const [todoItems, setTodoItems] = useState([{ text: '', isCompleted: false }]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: '',
        attachments: []
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get(apiPaths.USERS.GET_ALL_USERS);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const handleTodoChange = (index, field, value) => {
        const updatedTodos = [...todoItems];
        updatedTodos[index] = { ...updatedTodos[index], [field]: value };
        setTodoItems(updatedTodos);
    };

    const addTodoItem = () => {
        setTodoItems([...todoItems, { text: '', isCompleted: false }]);
    };

    const removeTodoItem = (index) => {
        if (todoItems.length > 1) {
            const updatedTodos = todoItems.filter((_, i) => i !== index);
            setTodoItems(updatedTodos);
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return false;
        }
        if (!formData.dueDate) {
            setError('Due date is required');
            return false;
        }
        if (!formData.assignedTo) {
            setError('Please assign the task to a user');
            return false;
        }
        if (new Date(formData.dueDate) < new Date()) {
            setError('Due date cannot be in the past');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const taskData = {
                ...formData,
                todoCheckList: todoItems.filter(item => item.text.trim() !== '')
            };

            const response = await api.post(apiPaths.TASKS.CREATE_TASK, taskData);
            
            setSuccess('Task created successfully!');
            setTimeout(() => {
                navigate('/admin/manage-tasks');
            }, 2000);

        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-100 rounded-lg shadow-lg p-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-600 mb-2">Create New Task</h1>
                        <p className="text-blue-400">Fill in the details below to create a new task</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-200 rounded-lg shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-2">
                                    Task Title *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-blue-700 mb-2">
                                    Priority *
                                </label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-blue-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter task description"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-blue-700 mb-2">
                                    Due Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="assignedTo" className="block text-sm font-medium text-blue-700 mb-2">
                                    Assign To *
                                </label>
                                <select
                                    id="assignedTo"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user._id} value={user._id}>
                                            {user.name} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-blue-700 mb-4">
                                Todo Checklist
                            </label>
                            <div className="space-y-3">
                                {todoItems.map((todo, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            checked={todo.isCompleted}
                                            onChange={(e) => handleTodoChange(index, 'isCompleted', e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                                        />
                                        <input
                                            type="text"
                                            value={todo.text}
                                            onChange={(e) => handleTodoChange(index, 'text', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter todo item"
                                        />
                                        {todoItems.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTodoItem(index)}
                                                className="px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTodoItem}
                                    className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                                >
                                    + Add Todo Item
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/manage-tasks')}
                                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Creating Task...' : 'Create Task'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTask;