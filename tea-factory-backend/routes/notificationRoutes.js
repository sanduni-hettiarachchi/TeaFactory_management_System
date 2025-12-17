
const express = require('express');
const Notifications = require('../model/Notifications');

const router = express.Router();

// Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notifications.find()
      .sort({ createdAt: -1 })
      .populate('recipient', 'name email');
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread notifications count
router.get('/notifications/unread-count', async (req, res) => {
  try {
    const count = await Notifications.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', async (req, res) => {
  try {
    const notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark all notifications as read
router.patch('/notifications/mark-all-read', async (req, res) => {
  try {
    await Notifications.updateMany({ read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete notification
router.delete('/notifications/:id', async (req, res) => {
  try {
    await Notifications.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new notification
router.post('/notifications', async (req, res) => {
  try {
    const notification = new Notifications(req.body);
    await notification.save();
    await notification.populate('recipient', 'name email');
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;