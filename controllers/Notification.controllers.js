// controllers/notification.controllers.js

import Notification from '../models/Notification.models.js';

class NotificationController {
  async createNotification(req, res) {
    const { driverId, title, message } = req.body;

    try {
      const newNotification = new Notification({
        driverId,
        title,
        message,
      });

      const savedNotification = await newNotification.save();
      res.status(201).json(savedNotification);
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getNotifications(req, res) {
    const { driverId } = req.params;

    try {
      const notifications = await Notification.find({ driverId });
      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async markAsRead(req, res) {
    const { notificationId } = req.params;

    try {
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      notification.isRead = true;
      const updatedNotification = await notification.save();

      res.status(200).json(updatedNotification);
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new NotificationController();
