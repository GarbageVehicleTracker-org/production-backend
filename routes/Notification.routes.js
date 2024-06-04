// routes/notification.routes.js

import express from 'express';
import NotificationController from '../controllers/Notification.controllers.js';

const NotificationRouter = express.Router();

NotificationRouter.post('/notifications', NotificationController.createNotification);
NotificationRouter.get('/notifications/:driverId?', NotificationController.getNotifications);
NotificationRouter.put('/notifications/:notificationId?', NotificationController.markAsRead);

export default NotificationRouter;
