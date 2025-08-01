import Task from '../models/Task.js';


const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;
        if (req.user.role === 'Admin') {
            tasks = await Task.find(filter).populate('assignedTo', 'name email profileImageUrl');
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate('assignedTo', 'name email profileImageUrl');
        }

        // add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoCheckList.filter(todo => todo.isCompleted === true).length;
                const totalCount = task.todoCheckList.length;
                const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                return { 
                    ...task._doc, 
                    completedCount,
                    totalCount,
                    progress
                };
            })
        );

        // status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === 'Admin' ? {} : { ...filter, assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
                ...filter, 
                status: 'Pending',
                ...(req.user.role !== 'Admin' && { assignedTo: req.user._id })
    });

        const inProgressTasks = await Task.countDocuments({
                ...filter, 
                status: 'In Progress',
                ...(req.user.role !== 'Admin' && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: 'Completed',
            ...(req.user.role !== 'Admin' && { assignedTo: req.user._id })
        });

        res.status(200).json({ message: 'Tasks fetched successfully', data: {
            tasks,
            statusSummary: {
            all: allTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks
            }
        } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');

        if (!task) { return res.status(404).json({ message: 'Task not found' }); }

        res.status(200).json({ message: 'Task fetched successfully', data: task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, assignedTo, attachements, todoCheckList } = req.body;

        if (!assignedTo) {
            return res.status(400).json({ message: 'Assigned to is required' });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachements,
            todoCheckList
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) { return res.status(404).json({ message: 'Task not found' }); }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.attachements = req.body.attachements || task.attachements;
        task.todoCheckList = req.body.todoCheckList || task.todoCheckList;

        if (req.body.assignedTo) {
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) { return res.status(404).json({ message: 'Task not found' }); }

        const isAssigned = task.assignedTo.toString() === req.user._id.toString();

        if (!isAssigned && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }

        task.status = req.body.status || task.status;
        if (task.status === 'Completed') {
            task.todoCheckList.forEach(todo => todo.isCompleted = true);
            task.progress = 100;
        }

        const updatedTask = await task.save();
        res.status(200).json({ message: 'Task status updated successfully', data: updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateTaskCheckList = async (req, res) => {
    try {
        const { todoCheckList } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const isAssigned = task.assignedTo.toString() === req.user._id.toString();
        if (!isAssigned && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'You are not authorized to update this task' });
        }
        
        // Update todoCheckList with proper validation
        if (todoCheckList && Array.isArray(todoCheckList)) {
            // Ensure each todo has the correct structure
            task.todoCheckList = todoCheckList.map(todo => ({
                text: todo.text || '',
                isCompleted: Boolean(todo.isCompleted || todo.completed || false)
            }));
        }
        
        // Calculate progress based on completed todos
        const completedCount = task.todoCheckList.filter(todo => todo.isCompleted === true).length;
        const totalCount = task.todoCheckList.length;
        task.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        // Auto-update task status based on progress
        if (task.progress === 100 && totalCount > 0) {
            task.status = 'Completed';
        } else if (task.progress > 0) {
            task.status = 'In Progress';
        } else {
            task.status = 'Pending';
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate('assignedTo', 'name email profileImageUrl');
        res.status(200).json({ 
            message: 'Task check list updated successfully', 
            data: updatedTask,
            progress: task.progress,
            completedCount,
            totalCount
        });
    } catch (error) {
        console.error('UpdateTaskCheckList error:', error);
        res.status(500).json({ message: error.message });
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) { return res.status(404).json({ message: 'Task not found' }); }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDashboardTasks = async (req, res) => {
    try {
        // fetch statistics for dashboard
        const allTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ 
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        });

        //insure all possible statuses are included
        const tasksStatus = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const taskDistribution = tasksStatus.reduce((acc, status) => {
            const formattedKey = status.toLowerCase().replace(/\s+/g, '_');
            const count = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            acc[formattedKey] = count;
            return acc;
        }, {});
        taskDistribution['all'] = allTasks;

        // const all priority levels are included
        const taskPriority = ['Low', 'Medium', 'High'];
        const taskPriorityRaw = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

            const taskPriorityLevels = taskPriority.reduce((acc, priority) => {
                acc[priority.toLowerCase().replace(/\s+/g, '_')] = taskPriorityRaw.find(item => item._id === priority)?.count || 0;
                return acc;
            }, {});
            
            // fetch recent 10 tasks
            const recentTasks = await Task.find({})
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title status priority dueDate createdAt');
            
            // fetch recent 10 completed tasks
            const recentCompletedTasks = await Task.find({ status: 'Completed' })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title status priority dueDate assignedTo createdAt');
            
           res.status(200).json({
            statistics: {
                allTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
            recentCompletedTasks
            });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserDashboardTasks = async (req, res) => {
    try {
        // fetch statistics for user dashboard
        const allTasks = await Task.countDocuments({ assignedTo: req.user._id });
        const pendingTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'Pending' });
        const completedTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'Completed' });
        const overdueTasks = await Task.countDocuments({ 
            assignedTo: req.user._id, 
            status: { $ne: 'Completed' }, 
            dueDate: { $lt: new Date() } 
        });
         // task distribution by status
         const tasksStatus = ['Pending', 'In Progress', 'Completed'];
        const taskDistributionRaw = await Task.aggregate([
            {
                $match: { assignedTo: req.user._id }
            },
            {
                $group: { _id: '$status', count: { $sum: 1 } }
            },
            { $sort: { count: -1 } }
        ]);

        const taskDistribution = tasksStatus.reduce((acc, status) => {
            const formattedKey = status.toLowerCase().replace(/\s+/g, '_');
            const count = taskDistributionRaw.find(item => item._id === status)?.count || 0;
            acc[formattedKey] = count;
            return acc;
        }, {});
        taskDistribution['all'] = allTasks;

        // task distribution by priority
        const taskPriority = ['Low', 'Medium', 'High'];
        const taskPriorityRaw = await Task.aggregate([
            {
                $match: { assignedTo: req.user._id }
            },
            {
                $group: { _id: '$priority', count: { $sum: 1 } }
            },
            { $sort: { count: -1 } }
        ]);

        const taskPriorityLevels = taskPriority.reduce((acc, priority) => {
            acc[priority.toLowerCase().replace(/\s+/g, '_')] = taskPriorityRaw.find(item => item._id === priority)?.count || 0;
            return acc;
        }, {});

        // fetch recent 10 tasks
        const recentTasks = await Task.find({ assignedTo: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate createdAt');

        // fetch recent 10 completed tasks
        const recentCompletedTasks = await Task.find({ assignedTo: req.user._id, status: 'Completed' })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title status priority dueDate assignedTo createdAt');

        res.status(200).json({
            statistics: {
                allTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks,
            recentCompletedTasks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export {
    getDashboardTasks,
    getUserDashboardTasks,
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    updateTaskCheckList,
    deleteTask
}