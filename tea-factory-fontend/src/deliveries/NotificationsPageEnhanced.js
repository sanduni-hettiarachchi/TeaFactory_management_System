// src/notifications/NotificationsPageEnhanced.jsx
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "dms_notifications_v1";
const EMAIL_TEMPLATES_STORAGE_KEY = "dms_email_templates_v1";
const ALERT_SETTINGS_STORAGE_KEY = "dms_alert_settings_v1";

const NOTIFICATION_TYPES = {
  delivery: { 
    icon: "🚚", 
    color: "bg-blue-50 border-blue-200 text-blue-800",
    badge: "bg-blue-100 text-blue-800"
  },
  driver: { 
    icon: "👨‍💼", 
    color: "bg-green-50 border-green-200 text-green-800",
    badge: "bg-green-100 text-green-800"
  },
  vehicle: { 
    icon: "🚛", 
    color: "bg-orange-50 border-orange-200 text-orange-800",
    badge: "bg-orange-100 text-orange-800"
  },
  system: { 
    icon: "⚙️", 
    color: "bg-purple-50 border-purple-200 text-purple-800",
    badge: "bg-purple-100 text-purple-800"
  },
  alert: { 
    icon: "⚠️", 
    color: "bg-red-50 border-red-200 text-red-800",
    badge: "bg-red-100 text-red-800"
  }
};

export default function NotificationsPageEnhanced() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [emailForm, setEmailForm] = useState({
    selectedDrivers: [],
    template: "",
    subject: "",
    message: ""
  });
  
  // Alert Settings
  const [alertSettings, setAlertSettings] = useState({
    email: { enabled: true, sound: true },
    sms: { enabled: false, sound: false },
    push: { enabled: true, sound: true },
    desktop: { enabled: true, sound: true },
    // Alert thresholds
    deliveryDelay: { enabled: true, threshold: 30 }, // minutes
    lowFuel: { enabled: true, threshold: 20 }, // percentage
    vehicleMaintenance: { enabled: true, threshold: 7 }, // days
    driverInactive: { enabled: true, threshold: 60 }, // minutes
  });

  // Email Templates
  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 1,
      name: "Daily Route Assignment",
      subject: "Your Daily Delivery Route - {date}",
      body: "Hello {driverName},\n\nYour route for today: {routeName}\n\nVehicle: {vehicle}\nStops: {stops}\nStart Time: {startTime}\n\nPlease confirm receipt.\n\nBest regards,\nDelivery Management Team",
      variables: ["driverName", "routeName", "vehicle", "stops", "startTime", "date"]
    },
    {
      id: 2,
      name: "Delivery Completion",
      subject: "Delivery Completed Successfully",
      body: "Hello {driverName},\n\nGreat job! Your delivery for {customerName} has been marked as completed.\n\nDelivery Details:\n- Time: {deliveryTime}\n- Location: {location}\n- Status: Delivered\n\nThank you for your hard work!",
      variables: ["driverName", "customerName", "deliveryTime", "location"]
    },
    {
      id: 3,
      name: "Vehicle Maintenance",
      subject: "Vehicle Maintenance Scheduled",
      body: "Hello {driverName},\n\nYour assigned vehicle {vehicle} is scheduled for maintenance on {date}.\n\nPlease make alternative arrangements.\n\nMaintenance Team",
      variables: ["driverName", "vehicle", "date"]
    },
    {
      id: 4,
      name: "Delivery Delay Alert",
      subject: "⚠️ Delivery Delay Notification",
      body: "Hello {driverName},\n\nWe noticed your delivery to {customerName} is running {delayMinutes} minutes behind schedule.\n\nPlease update the customer and provide a new ETA.\n\nOrder: {orderId}\nOriginal ETA: {originalETA}\n\nThank you!",
      variables: ["driverName", "customerName", "delayMinutes", "orderId", "originalETA"]
    }
  ]);

  const [templateForm, setTemplateForm] = useState({
    name: "",
    subject: "",
    body: "",
    variables: []
  });

  // Sample notifications
  const sampleNotifications = [
    {
      id: 1,
      type: "delivery",
      title: "New Delivery Assignment",
      message: "You have been assigned to deliver 25kg of Green Tea to Chamod Perera",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      priority: "high",
      actionRequired: true
    },
    {
      id: 2,
      type: "driver",
      title: "Driver Performance Update",
      message: "Kamal Perera completed 8 deliveries this week with 100% success rate",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true,
      priority: "medium"
    },
    {
      id: 3,
      type: "alert",
      title: "Delivery Delay Alert",
      message: "Delivery #1234 is running 45 minutes behind schedule",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      read: false,
      priority: "high",
      actionRequired: true
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load notifications
    const storedNotifications = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      setNotifications(sampleNotifications);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sampleNotifications));
    }

    // Load templates
    const storedTemplates = localStorage.getItem(EMAIL_TEMPLATES_STORAGE_KEY);
    if (storedTemplates) {
      setEmailTemplates(JSON.parse(storedTemplates));
    }

    // Load alert settings
    const storedSettings = localStorage.getItem(ALERT_SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      setAlertSettings(JSON.parse(storedSettings));
    }

    // Load drivers from API
    try {
      const response = await fetch("http://localhost:3001/api/drivers");
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }

    setLoading(false);
  };

  const handleSendEmail = async () => {
    const { selectedDrivers, subject, message } = emailForm;
    
    if (selectedDrivers.length === 0) {
      alert("⚠️ Please select at least one driver");
      return;
    }
    
    if (!subject || !message) {
      alert("⚠️ Please fill in subject and message");
      return;
    }
    
    try {
      const emailPromises = selectedDrivers.map(async (driverId) => {
        const driver = drivers.find(d => (d._id || d.id) === driverId);
        if (!driver || !driver.email) {
          return { success: false, driver: driver?.name, reason: "No email" };
        }
        
        const response = await fetch("http://localhost:3001/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: driver.email,
            subject: subject,
            text: message.replace(/{driverName}/g, driver.name)
          })
        });
        
        return {
          success: response.ok,
          driver: driver.name,
          email: driver.email
        };
      });
      
      const results = await Promise.all(emailPromises);
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      alert(`✅ Email sent successfully to ${successful} driver(s)${failed > 0 ? `\n⚠️ Failed: ${failed}` : ""}`);
      
      setShowEmailModal(false);
      setEmailForm({
        selectedDrivers: [],
        template: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("❌ Failed to send emails");
    }
  };

  const saveAlertSettings = () => {
    localStorage.setItem(ALERT_SETTINGS_STORAGE_KEY, JSON.stringify(alertSettings));
    setShowSettingsModal(false);
    alert("✅ Alert settings saved successfully!");
  };

  const handleTemplateSubmit = (e) => {
    e.preventDefault();
    
    if (editingTemplate) {
      // Update existing template
      const updated = emailTemplates.map(t => 
        t.id === editingTemplate.id ? { ...templateForm, id: t.id } : t
      );
      setEmailTemplates(updated);
      localStorage.setItem(EMAIL_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    } else {
      // Add new template
      const newTemplate = {
        ...templateForm,
        id: Date.now(),
        variables: extractVariables(templateForm.subject + " " + templateForm.body)
      };
      const updated = [...emailTemplates, newTemplate];
      setEmailTemplates(updated);
      localStorage.setItem(EMAIL_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
    }

    setShowTemplateModal(false);
    setEditingTemplate(null);
    setTemplateForm({ name: "", subject: "", body: "", variables: [] });
    alert("✅ Template saved successfully!");
  };

  const extractVariables = (text) => {
    const matches = text.match(/\{([^}]+)\}/g);
    if (!matches) return [];
    return [...new Set(matches.map(m => m.slice(1, -1)))];
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      variables: template.variables || []
    });
    setShowTemplateModal(true);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updated = emailTemplates.filter(t => t.id !== templateId);
      setEmailTemplates(updated);
      localStorage.setItem(EMAIL_TEMPLATES_STORAGE_KEY, JSON.stringify(updated));
      alert("✅ Template deleted successfully!");
    }
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    alert("✅ All notifications marked as read!");
  };

  const deleteNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      alert("✅ All notifications cleared!");
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    if (activeTab === "action") return n.actionRequired;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.actionRequired).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notifications & Alerts</h1>
          <p className="text-gray-600">Manage your notifications, alert settings, and email templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  ⚙️ Alert Settings
                </button>
                <button
                  onClick={() => {
                    setEditingTemplate(null);
                    setTemplateForm({ name: "", subject: "", body: "", variables: [] });
                    setShowTemplateModal(true);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  ➕ New Template
                </button>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  📧 Email Drivers
                </button>
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white">Quick Templates</h2>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                {emailTemplates.map(template => (
                  <div
                    key={template.id}
                    className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900 mb-1">{template.name}</div>
                    <div className="text-xs text-gray-600 truncate mb-2">{template.subject}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEmailForm({
                            ...emailForm,
                            template: template.id.toString(),
                            subject: template.subject,
                            message: template.body
                          });
                          setShowEmailModal(true);
                        }}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        📧 Use
                      </button>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex overflow-x-auto">
                    {["all", "unread", "action", "delivery", "driver", "vehicle", "alert"].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-shrink-0 px-6 py-4 font-medium capitalize transition-colors duration-200 ${
                          activeTab === tab
                            ? "text-green-600 border-b-2 border-green-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {tab === "all" ? "All" : 
                         tab === "unread" ? `Unread (${unreadCount})` :
                         tab === "action" ? `Action (${actionRequiredCount})` : 
                         tab}
                      </button>
                    ))}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 px-4">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                      >
                        ✓ Mark All Read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors whitespace-nowrap"
                      >
                        🗑️ Clear All
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                ) : filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`border-b border-gray-100 p-6 transition-all duration-200 hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-2xl p-3 rounded-xl ${NOTIFICATION_TYPES[notification.type]?.color}`}>
                          {NOTIFICATION_TYPES[notification.type]?.icon}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${NOTIFICATION_TYPES[notification.type]?.badge}`}>
                              {notification.type}
                            </span>
                            {notification.priority === "high" && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                High Priority
                              </span>
                            )}
                            {!notification.read && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                              >
                                ✓ Mark as Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p>No notifications found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">⚙️ Alert Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Notification Channels */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  {Object.entries(alertSettings).filter(([key]) => 
                    ['email', 'sms', 'push', 'desktop'].includes(key)
                  ).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium capitalize">{key} Notifications</div>
                        <div className="text-sm text-gray-600">Receive {key} alerts</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={value.enabled}
                            onChange={(e) => setAlertSettings({
                              ...alertSettings,
                              [key]: { ...value, enabled: e.target.checked }
                            })}
                            className="w-5 h-5"
                          />
                          <span className="text-sm">Enabled</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={value.sound}
                            onChange={(e) => setAlertSettings({
                              ...alertSettings,
                              [key]: { ...value, sound: e.target.checked }
                            })}
                            className="w-5 h-5"
                          />
                          <span className="text-sm">Sound</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alert Thresholds */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Alert Thresholds</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">Delivery Delay Alert</label>
                      <input
                        type="checkbox"
                        checked={alertSettings.deliveryDelay.enabled}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          deliveryDelay: { ...alertSettings.deliveryDelay, enabled: e.target.checked }
                        })}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={alertSettings.deliveryDelay.threshold}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          deliveryDelay: { ...alertSettings.deliveryDelay, threshold: parseInt(e.target.value) }
                        })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                      <span className="text-sm text-gray-600">minutes delay</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">Low Fuel Alert</label>
                      <input
                        type="checkbox"
                        checked={alertSettings.lowFuel.enabled}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          lowFuel: { ...alertSettings.lowFuel, enabled: e.target.checked }
                        })}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={alertSettings.lowFuel.threshold}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          lowFuel: { ...alertSettings.lowFuel, threshold: parseInt(e.target.value) }
                        })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                      <span className="text-sm text-gray-600">% fuel remaining</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">Vehicle Maintenance Alert</label>
                      <input
                        type="checkbox"
                        checked={alertSettings.vehicleMaintenance.enabled}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          vehicleMaintenance: { ...alertSettings.vehicleMaintenance, enabled: e.target.checked }
                        })}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={alertSettings.vehicleMaintenance.threshold}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          vehicleMaintenance: { ...alertSettings.vehicleMaintenance, threshold: parseInt(e.target.value) }
                        })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                      <span className="text-sm text-gray-600">days before due</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium">Driver Inactive Alert</label>
                      <input
                        type="checkbox"
                        checked={alertSettings.driverInactive.enabled}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          driverInactive: { ...alertSettings.driverInactive, enabled: e.target.checked }
                        })}
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={alertSettings.driverInactive.threshold}
                        onChange={(e) => setAlertSettings({
                          ...alertSettings,
                          driverInactive: { ...alertSettings.driverInactive, threshold: parseInt(e.target.value) }
                        })}
                        className="w-20 px-3 py-2 border rounded-lg"
                      />
                      <span className="text-sm text-gray-600">minutes inactive</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3">
                <button
                  onClick={saveAlertSettings}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium"
                >
                  💾 Save Settings
                </button>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingTemplate ? "✏️ Edit Template" : "➕ New Template"}
              </h2>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setEditingTemplate(null);
                }}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleTemplateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Daily Route Assignment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Use {variableName} for dynamic content"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Body <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={templateForm.body}
                  onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Use {variableName} for dynamic content&#10;&#10;Available variables:&#10;{driverName}, {customerName}, {date}, {time}, {vehicle}, {routeName}, etc."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-900 mb-2">💡 Tips:</div>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use {`{variableName}`} for dynamic content</li>
                  <li>• Common variables: {`{driverName}, {customerName}, {date}, {vehicle}`}</li>
                  <li>• Variables will be replaced with actual data when sending</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-medium"
                >
                  💾 Save Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateModal(false);
                    setEditingTemplate(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Drivers Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">📧 Send Email to Drivers</h2>
            
            <div className="space-y-4">
              {/* Select Drivers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Drivers <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailForm.selectedDrivers.length === drivers.filter(d => d.email).length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEmailForm({
                            ...emailForm,
                            selectedDrivers: drivers.filter(d => d.email).map(d => d._id || d.id)
                          });
                        } else {
                          setEmailForm({ ...emailForm, selectedDrivers: [] });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold">Select All</span>
                  </label>
                  {drivers.map(driver => (
                    <label key={driver._id || driver.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailForm.selectedDrivers.includes(driver._id || driver.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEmailForm({
                              ...emailForm,
                              selectedDrivers: [...emailForm.selectedDrivers, driver._id || driver.id]
                            });
                          } else {
                            setEmailForm({
                              ...emailForm,
                              selectedDrivers: emailForm.selectedDrivers.filter(id => id !== (driver._id || driver.id))
                            });
                          }
                        }}
                        disabled={!driver.email}
                        className="w-4 h-4"
                      />
                      <span className={!driver.email ? 'text-gray-400' : ''}>
                        {driver.name} {driver.email ? `(${driver.email})` : '(No email)'}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {drivers.filter(d => d.email).length} driver(s) with email addresses
                </p>
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Use Template (Optional)
                </label>
                <select
                  value={emailForm.template}
                  onChange={(e) => {
                    const template = emailTemplates.find(t => t.id === parseInt(e.target.value));
                    if (template) {
                      setEmailForm({
                        ...emailForm,
                        template: e.target.value,
                        subject: template.subject,
                        message: template.body
                      });
                    } else {
                      setEmailForm({ ...emailForm, template: "", subject: "", message: "" });
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">-- Select a template --</option>
                  {emailTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Enter your message here... Use {driverName} for personalization"
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: Use {`{driverName}`} to personalize the message
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendEmail}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-semibold"
                >
                  📧 Send Email
                </button>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailForm({
                      selectedDrivers: [],
                      template: "",
                      subject: "",
                      message: ""
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}