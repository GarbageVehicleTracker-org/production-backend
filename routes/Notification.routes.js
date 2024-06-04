// routes/notification.routes.js

import express from 'express';
import NotificationController from '../controllers/Notification.controllers.js';

const NotificationRouter = express.Router();

router.post('/notifications', NotificationController.createNotification);
router.get('/notifications/:driverId', NotificationController.getNotifications);
router.put('/notifications/:notificationId', NotificationController.markAsRead);

export default NotificationRouter;
