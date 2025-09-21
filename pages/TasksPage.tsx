
import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../services/hooks/useAuth';
import { api } from '../services/api';
import { Task, UserRole } from '../types';
import { PlusIcon, TaskIcon, EditIcon, TrashIcon } from '../components/icons';

const EditTaskModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
}> = ({ isOpen, onClose, task, onTaskUpdated }) => {
    const [title, setTitle] = useState(task.title);
    const [deadline, setDeadline] = useState(new Date(task.deadline).toISOString().split('T')[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    useEffect(() => {
        setTitle(task.title);
        setDeadline(new Date(task.deadline).toISOString().split('T')[0]);
    }, [task]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updatedTask = await api.updateTask(task.id, title, new Date(deadline).toISOString());
            if (updatedTask) {
                onTaskUpdated(updatedTask);
            }
            onClose();
        } catch (error) {
            console.error("Failed to update task", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <h2 className="text-2xl font-bold mb-6 text-on-surface text-center">تعديل المهمة</h2>
                    <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">عنوان المهمة</label>
                        <input id="task-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                     <div>
                        <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-1">تاريخ الاستحقاق</label>
                        <input id="task-deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                     <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">إلغاء</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-400">{isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const TasksPage: React.FC = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        if (user) {
            setLoading(true);
            api.getTasks(user).then(data => {
                setTasks(data);
                setLoading(false);
            });
        }
    }, [user]);

    const handleToggleTask = async (taskId: string) => {
        const originalTasks = [...tasks];
        const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, isDone: !t.isDone } : t);
        setTasks(updatedTasks);
        try {
            await api.toggleTask(taskId);
        } catch (error) {
            console.error("Failed to update task", error);
            setTasks(originalTasks);
        }
    };
    
    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newTaskTitle.trim()) return;
        const deadline = new Date(Date.now() + 7 * 86400000).toISOString();
        const caseId = 'c1'; // Mock caseId
        const newTask = await api.addTask(newTaskTitle, deadline, caseId);
        setTasks(prevTasks => [...prevTasks, newTask]);
        setNewTaskTitle('');
    };
    
    const handleDeleteTask = async (taskId: string) => {
        if(window.confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
            const success = await api.deleteTask(taskId);
            if (success) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
            }
        }
    };
    
    const handleTaskUpdated = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
        setEditingTask(null);
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [tasks, searchTerm]);

    const pendingTasks = filteredTasks.filter(t => !t.isDone);
    const completedTasks = filteredTasks.filter(t => t.isDone);
    
    const canEdit = user && (user.role === UserRole.ADMIN || user.role === UserRole.PARTNER || (user.role === UserRole.SECRETARY && user.permissions === 'full'));

    return (
        <div>
            {editingTask && canEdit && (
                <EditTaskModal 
                    isOpen={!!editingTask}
                    onClose={() => setEditingTask(null)}
                    task={editingTask}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}
            <h1 className="text-3xl font-bold text-white mb-6">المهام</h1>
            
            <div className="bg-surface rounded-lg shadow mb-8 p-4 space-y-4">
                 {canEdit && (
                    <form onSubmit={handleAddTask} className="flex items-center space-x-4 space-x-reverse">
                        <input
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="أضف مهمة جديدة..."
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                        <button type="submit" className="flex-shrink-0 flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary-dark">
                            <span className="ml-2">إضافة</span>
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </form>
                 )}
                 <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="بحث في المهام..."
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">معلقة ({pendingTasks.length})</h2>
                    <div className="space-y-3">
                         {loading ? <p>جاري التحميل...</p> : pendingTasks.length > 0 ? (
                             pendingTasks.map(task => (
                                 <div key={task.id} className="bg-surface rounded-lg shadow-sm p-3 flex items-center">
                                     <input 
                                         type="checkbox"
                                         checked={task.isDone}
                                         onChange={() => handleToggleTask(task.id)}
                                         disabled={!canEdit}
                                         className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary-light cursor-pointer ml-4 disabled:cursor-not-allowed"
                                     />
                                     <div className="flex-grow">
                                         <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                         <p className="text-xs text-red-600">تاريخ الاستحقاق: {new Date(task.deadline).toLocaleDateString('ar-EG')}</p>
                                     </div>
                                     {canEdit && (
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => setEditingTask(task)} className="text-gray-400 hover:text-primary"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteTask(task.id)} className="text-gray-400 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                     )}
                                 </div>
                             ))
                         ) : (
                             <div className="text-center py-8 border-2 border-dashed border-gray-500 rounded-lg">
                                <TaskIcon className="mx-auto h-10 w-10 text-gray-400"/>
                                <p className="mt-2 text-sm text-gray-300">لا توجد مهام معلقة. عمل رائع!</p>
                             </div>
                         )}
                    </div>
                </div>
                 <div>
                    <h2 className="text-xl font-semibold text-white mb-4">مكتملة ({completedTasks.length})</h2>
                    <div className="space-y-3">
                         {loading ? <p>جاري التحميل...</p> : completedTasks.length > 0 ? (
                            completedTasks.map(task => (
                                 <div key={task.id} className="bg-surface rounded-lg shadow-sm p-3 flex items-center opacity-60">
                                      <input 
                                         type="checkbox"
                                         checked={task.isDone}
                                         onChange={() => handleToggleTask(task.id)}
                                         disabled={!canEdit}
                                         className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary-light cursor-pointer ml-4 disabled:cursor-not-allowed"
                                     />
                                     <div className="flex-grow">
                                         <p className="text-sm font-medium text-gray-600 line-through">{task.title}</p>
                                     </div>
                                 </div>
                             ))
                         ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-500 rounded-lg">
                                <p className="mt-2 text-sm text-gray-300">لم تكتمل أي مهام بعد.</p>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;