const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['delivery', 'driver', 'vehicle', 'system', 'alert'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  relatedEntity: {
    entityType: String, // 'Delivery', 'Driver', 'Vehicle'
    entityId: mongoose.Schema.Types.ObjectId
  }
}, {
  timestamps: true
});

const Notifications =  mongoose.model('Notifications', notificationsSchema);
module.exports = Notifications