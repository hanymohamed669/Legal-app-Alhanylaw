
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api } from '../api';
import { SessionNotification, Session, UserRole, Task } from '../../types';

export const useNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<SessionNotification[]>([]);

    useEffect(() => {
        if (!user || user.role === UserRole.CLIENT) {
            return;
        }

        const checkEvents = async () => {
            try {
                const [sessions, tasks] = await Promise.all([
                    api.getSessions(user),
                    api.getTasks(user)
                ]);

                const now = new Date();
                const upcomingNotifications: SessionNotification[] = [];
                
                const ONE_HOUR = 60 * 60 * 1000;
                const ONE_DAY = 24 * ONE_HOUR;

                sessions.forEach((session: Session) => {
                    const sessionTime = new Date(session.dateTime);
                    const diff = sessionTime.getTime() - now.getTime();

                    if (diff > 0) { // Session is in the future
                        let message = '';
                        let timeUntil = '';

                        if (diff <= ONE_HOUR) {
                            message = `جلسة (${session.caseName || session.courtName}) تبدأ قريباً.`;
                            timeUntil = `خلال ساعة`;
                        } else if (diff <= ONE_DAY) {
                             message = `تذكير: جلسة (${session.caseName || session.courtName}) غداً.`;
                             timeUntil = `خلال 24 ساعة`;
                        }

                        if(message) {
                            upcomingNotifications.push({
                                id: session.id,
                                message,
                                session,
                                timeUntil,
                            });
                        }
                    }
                });

                tasks.forEach((task: Task) => {
                    if (task.isDone) return;

                    const deadlineTime = new Date(task.deadline);
                    const diff = deadlineTime.getTime() - now.getTime();

                    if (diff > 0 && diff <= ONE_DAY) {
                         upcomingNotifications.push({
                            id: task.id,
                            message: `تذكير: موعد استحقاق مهمة (${task.title}) غداً.`,
                            task,
                            timeUntil: 'خلال 24 ساعة'
                         });
                    }
                });


                setNotifications(upcomingNotifications);

            } catch (error) {
                console.error("Failed to fetch events for notifications:", error);
            }
        };

        checkEvents();
        const intervalId = setInterval(checkEvents, 60000); // Check every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [user]);

    return { notifications };
};