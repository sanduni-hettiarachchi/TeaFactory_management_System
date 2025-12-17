// ProfilePageEnhanced.jsx - Comprehensive Profile Management with Enhanced Features
import React, { useState, useEffect } from 'react';

// Error Boundary Component for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                🔄 Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors"
              >
                🔄 Try Again
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const PROFILE_STORAGE_KEY = "dms_profile_v1";
const PREFERENCES_STORAGE_KEY = "dms_preferences_v1";

export default function ProfilePageEnhanced() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contactNumber: "",
    role: "",
    department: "Delivery & Logistics",
    joinDate: "",
    avatar: "",
    bio: "",
    address: "",
    emergencyContact: "",
    emergencyName: ""
  });

  const [tempAvatar, setTempAvatar] = useState(""); // Temporary avatar preview
  const [activityLog, setActivityLog] = useState([
    { action: "Profile created", time: new Date().toISOString(), type: "profile" },
    { action: "Preferences initialized", time: new Date(Date.now() - 3600000).toISOString(), type: "settings" },
    { action: "First login", time: new Date(Date.now() - 7200000).toISOString(), type: "security" }
  ]);
  const [avatarError, setAvatarError] = useState("");

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "english",
    notifications: {
      email: true,
      sms: false,
      push: true,
      sound: true,
      desktop: true
    },
    dashboardView: "grid",
    autoRefresh: true,
    refreshInterval: 30,
    timezone: "Asia/Colombo",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h"
  });

  const [stats, setStats] = useState({
    deliveriesManaged: 0,
    thisWeek: 0,
    successRate: 0,
    pendingActions: 0,
    totalDrivers: 0,
    activeVehicles: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Initialize activity log on component mount
  useEffect(() => {
    const initializeData = async () => {
      console.log("Component mounted, initializing data...");

      // Load profile first to ensure loading state is cleared
      await loadProfile();

      // Load other data
      await loadPreferences();
      loadStats();
      loadActivityLog();

      console.log("All data loaded successfully");
    };

    initializeData();
  }, []);

  // Apply preferences when they change
  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    if (preferences.theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else if (preferences.theme === 'light') {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    } else if (preferences.theme === 'auto') {
      // Auto theme based on system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }

    // Apply language (placeholder for future i18n implementation)
    document.documentElement.setAttribute('lang', preferences.language);

    console.log("Applied preferences:", preferences.theme, preferences.language);
  }, [preferences]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (preferences.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          root.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [preferences.theme]);

  const loadProfile = async () => {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const loadedProfile = JSON.parse(stored);
        console.log("Loaded profile from localStorage:", loadedProfile);

        // Validate and clean the loaded profile
        const cleanedProfile = { ...loadedProfile };

        // Ensure avatar exists and is valid
        if (cleanedProfile && typeof cleanedProfile.avatar === 'undefined') {
          cleanedProfile.avatar = "";
          console.log("Fixed missing avatar property");
        }

        // Check if avatar data looks valid (should start with data:image/)
        if (cleanedProfile.avatar && !cleanedProfile.avatar.startsWith('data:image/')) {
          console.warn("Invalid avatar data format detected, clearing avatar");
          cleanedProfile.avatar = "";
        }

        // Check avatar size (should be reasonable)
        if (cleanedProfile.avatar && cleanedProfile.avatar.length > 3 * 1024 * 1024) {
          console.warn("Avatar data seems too large, clearing to prevent issues");
          cleanedProfile.avatar = "";
        }

        setProfile(cleanedProfile);
        setTempAvatar(""); // Clear temp avatar when loading profile
        setAvatarError(""); // Clear any avatar errors

        console.log("Profile loaded successfully. Avatar size:", cleanedProfile.avatar ? cleanedProfile.avatar.length : 0, "characters");
      } else {
        console.log("No profile found in localStorage, creating default");
        // Default profile
        const defaultProfile = {
          name: "Delivery Manager",
          email: "manager@delivery.com",
          contactNumber: "0771234567",
          role: "Delivery Manager",
          department: "Delivery & Logistics",
          joinDate: "2024-01-15",
          avatar: "",
          bio: "Managing delivery operations and ensuring timely distribution.",
          address: "123 Main Street, Colombo 07",
          emergencyContact: "0777654321",
          emergencyName: "Emergency Contact"
        };
        setProfile(defaultProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading profile:", error);
      setLoading(false);

      // If profile loading fails, try to recover with default profile
      if (error.message.includes('JSON')) {
        console.log("Profile data corrupted, creating fresh profile");
        const defaultProfile = {
          name: "Delivery Manager",
          email: "manager@delivery.com",
          contactNumber: "0771234567",
          role: "Delivery Manager",
          department: "Delivery & Logistics",
          joinDate: "2024-01-15",
          avatar: "",
          bio: "Managing delivery operations and ensuring timely distribution.",
          address: "123 Main Street, Colombo 07",
          emergencyContact: "0777654321",
          emergencyName: "Emergency Contact"
        };
        setProfile(defaultProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
        setAvatarError("Profile data was corrupted and has been reset");
      } else {
        setAvatarError("Failed to load profile data: " + error.message);
      }
    }
  };

  const loadPreferences = async () => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      } else {
        // Save default preferences if none exist
        const defaultPrefs = {
          theme: "light",
          language: "english",
          notifications: {
            email: true,
            sms: false,
            push: true,
            sound: true,
            desktop: true
          },
          dashboardView: "grid",
          autoRefresh: true,
          refreshInterval: 30,
          timezone: "Asia/Colombo",
          dateFormat: "DD/MM/YYYY",
          timeFormat: "12h"
        };
        setPreferences(defaultPrefs);
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPrefs));
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  // API Service for backend integration
  const API_BASE_URL = 'http://localhost:3001/api';

  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API call to: ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      console.log("Loading stats from backend...");

      // Try to fetch real data from backend
      const [driversData, vehiclesData, deliveriesData] = await Promise.allSettled([
        apiCall('/drivers'),
        apiCall('/vehicles'),
        apiCall('/deliveries')
      ]);

      let drivers = [];
      let vehicles = [];
      let deliveries = [];

      // Extract data from successful promises
      if (driversData.status === 'fulfilled') {
        drivers = driversData.value || [];
      } else {
        console.warn("Drivers API failed:", driversData.reason);
      }

      if (vehiclesData.status === 'fulfilled') {
        vehicles = vehiclesData.value || [];
      } else {
        console.warn("Vehicles API failed:", vehiclesData.reason);
      }

      if (deliveriesData.status === 'fulfilled') {
        deliveries = deliveriesData.value || [];
      } else {
        console.warn("Deliveries API failed:", deliveriesData.reason);
      }

      // Calculate stats from real data
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const thisWeekDeliveries = deliveries.filter(d =>
        new Date(d.createdAt || d.date) >= weekAgo
      );

      const completedDeliveries = deliveries.filter(d =>
        d.status === 'Delivered' || d.status === 'delivered'
      );

      const pendingDeliveries = deliveries.filter(d =>
        d.status === 'Pending' || d.status === 'Out for Delivery' || d.status === 'pending'
      );

      const newStats = {
        deliveriesManaged: deliveries.length,
        thisWeek: thisWeekDeliveries.length,
        successRate: deliveries.length > 0
          ? Math.round((completedDeliveries.length / deliveries.length) * 100)
          : 0,
        pendingActions: pendingDeliveries.length,
        totalDrivers: drivers.length,
        activeVehicles: vehicles.filter(v => v.status === 'available').length
      };

      console.log("Calculated stats:", newStats);
      setStats(newStats);

      // Add activity log entry for stats update
      addActivityLog(`Dashboard updated - ${deliveries.length} deliveries, ${drivers.length} drivers`, "data");

    } catch (error) {
      console.error("Error loading stats:", error);

      // Fallback to mock data if backend is unavailable
      console.log("Using fallback mock data");
      const mockStats = {
        deliveriesManaged: 24,
        thisWeek: 8,
        successRate: 92,
        pendingActions: 3,
        totalDrivers: 12,
        activeVehicles: 8
      };
      setStats(mockStats);

      setMessage("⚠️ Using offline data - backend unavailable");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const loadActivityLog = () => {
    try {
      const stored = localStorage.getItem('dms_activity_log_v1');
      if (stored) {
        const parsedLog = JSON.parse(stored);
        console.log("Loaded activity log:", parsedLog);
        setActivityLog(parsedLog);
      } else {
        console.log("No activity log found, creating default");
        // Default activity log with some initial activities
        const defaultLog = [
          { action: "Profile created", time: new Date().toISOString(), type: "profile" },
          { action: "Preferences initialized", time: new Date(Date.now() - 3600000).toISOString(), type: "settings" },
          { action: "First login", time: new Date(Date.now() - 7200000).toISOString(), type: "security" }
        ];
        setActivityLog(defaultLog);
        localStorage.setItem('dms_activity_log_v1', JSON.stringify(defaultLog));
      }
    } catch (error) {
      console.error("Error loading activity log:", error);
      // Set empty array as fallback
      setActivityLog([]);
    }
  };

  const addActivityLog = (action, type = "general") => {
    const newActivity = {
      action,
      time: new Date().toISOString(),
      type
    };
    const updated = [newActivity, ...activityLog].slice(0, 20); // Keep last 20
    setActivityLog(updated);
    localStorage.setItem('dms_activity_log_v1', JSON.stringify(updated));
  };

  // Debounce utility for performance optimization
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Debounced profile change handler for better performance
  const debouncedHandleProfileChange = debounce((e) => {
    const { name, value } = e.target;
    setProfile(prev => ({...prev, [name]: value}));
  }, 300);

  // Optimized profile change handler
  const handleProfileChange = (e) => {
    // For immediate feedback on required fields, handle synchronously
    if (e.target.hasAttribute('required') || e.target.name === 'name' || e.target.name === 'contactNumber') {
      const { name, value } = e.target;
      setProfile(prev => ({...prev, [name]: value}));
    } else {
      // For other fields, use debounced version for better performance
      debouncedHandleProfileChange(e);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({...passwords, [name]: value});
  };

  const handlePreferenceChange = (section, key, value) => {
    if (section === "notifications") {
      setPreferences(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("🔄 Saving profile...");
    setAvatarError("");

    try {
      // Apply temporary avatar to profile if exists
      const updatedProfile = tempAvatar ? { ...profile, avatar: tempAvatar } : profile;

      console.log("Saving profile:", updatedProfile);
      console.log("tempAvatar value:", tempAvatar);
      console.log("profile.avatar before save:", profile.avatar);

      // Validate avatar size before saving
      if (updatedProfile.avatar && updatedProfile.avatar.length > 2 * 1024 * 1024) {
        throw new Error("Avatar data is too large. Please upload a smaller image.");
      }

      // Save to localStorage with error handling
      try {
        const profileString = JSON.stringify(updatedProfile);
        console.log("Profile data size:", profileString.length, "characters");

        localStorage.setItem(PROFILE_STORAGE_KEY, profileString);

        // Verify the save was successful
        const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log("Verified saved profile:", parsed);

          // Check if avatar was saved correctly
          if (updatedProfile.avatar && parsed.avatar !== updatedProfile.avatar) {
            console.warn("Avatar data mismatch after save!");
            // Try to recover by re-saving
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
            const recheck = localStorage.getItem(PROFILE_STORAGE_KEY);
            const reparsed = JSON.parse(recheck);
            if (reparsed.avatar !== updatedProfile.avatar) {
              throw new Error("Avatar data could not be saved correctly. The image might be too large for local storage.");
            }
          }
        } else {
          throw new Error("Failed to save to localStorage");
        }
      } catch (storageError) {
        console.error("Storage error:", storageError);
        if (storageError.name === 'QuotaExceededError' || storageError.message.includes('too large')) {
          throw new Error("Storage quota exceeded. Please use a smaller image or clear some browser data.");
        }
        throw new Error("Failed to save profile data. " + storageError.message);
      }

      // Update profile state with new avatar
      if (tempAvatar) {
        setProfile(updatedProfile);
        setTempAvatar(""); // Clear temporary avatar after successful save
        console.log("Avatar saved successfully, cleared tempAvatar");
      }

      // Add to activity log
      addActivityLog("Profile information updated", "profile");

      setTimeout(() => {
        setSaving(false);
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      }, 1000);
    } catch (error) {
      setSaving(false);
      setAvatarError(error.message || "❌ Failed to save profile");
      setMessage("❌ Failed to save profile");
      console.error("Save profile error:", error);
      setTimeout(() => {
        setMessage("");
        setAvatarError("");
      }, 5000);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMessage("");

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessage("❌ New passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 8) {
      setMessage("❌ Password must be at least 8 characters");
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwords.newPassword)) {
      setMessage("❌ Password must contain uppercase, lowercase, and number");
      return;
    }

    setSaving(true);
    setMessage("🔄 Changing password...");

    try {
      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        setMessage("✅ Password changed successfully!");
        setPasswords({currentPassword: "", newPassword: "", confirmNewPassword: ""});
        addActivityLog("Password changed", "security");
        setTimeout(() => setMessage(""), 3000);
      }, 1000);
    } catch (error) {
      setSaving(false);
      setMessage("❌ Failed to change password");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setMessage("🔄 Saving preferences...");

    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
      addActivityLog("Preferences updated", "settings");

      setTimeout(() => {
        setSaving(false);
        setMessage("✅ Preferences saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }, 1000);
    } catch (error) {
      setSaving(false);
      setMessage("❌ Failed to save preferences");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(resolve, 'image/jpeg', quality);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarError(""); // Clear previous errors

      if (file.size > 5 * 1024 * 1024) { // 5MB limit for original file
        setAvatarError("❌ Image size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        setAvatarError("❌ Please select a valid image file");
        return;
      }

      console.log("Starting file processing for avatar:", file.name, "Size:", file.size);

      setMessage("🔄 Processing image...");

      try {
        // Compress the image first
        const compressedBlob = await compressImage(file, 400, 400, 0.7);

        if (compressedBlob.size > 2 * 1024 * 1024) { // 2MB limit for compressed
          setAvatarError("❌ Compressed image is still too large. Please choose a smaller image.");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            console.log("Image processed successfully, size:", compressedBlob.size, "bytes");
            setTempAvatar(e.target.result);
            setAvatarError("");
            setMessage("✅ Avatar ready! Click 'Save Profile Changes' to apply.");
          } catch (error) {
            setAvatarError("❌ Error processing image. Please try again.");
            console.error("Avatar processing error:", error);
          }
        };

        reader.onerror = () => {
          setAvatarError("❌ Error reading file. Please try again.");
          console.error("FileReader error");
        };

        reader.readAsDataURL(compressedBlob);
      } catch (error) {
        setAvatarError("❌ Error compressing image. Please try a different image.");
        console.error("Image compression error:", error);
      }
    }
  };

  const removeAvatar = () => {
    setTempAvatar(""); // Clear temporary avatar
    setProfile(prev => ({...prev, avatar: ""})); // Clear saved avatar
    setAvatarError(""); // Clear avatar errors
    setMessage("✅ Avatar will be removed when you save.");
  };

  const cancelAvatarChange = () => {
    setTempAvatar(""); // Clear temporary avatar
    setAvatarError(""); // Clear avatar errors
    setMessage("Avatar change cancelled");
    setTimeout(() => setMessage(""), 3000);
  };

  const exportData = () => {
    try {
      console.log("Starting export process...");

      // Collect all localStorage data
      const allData = {
        exportInfo: {
          exportDate: new Date().toISOString(),
          exportVersion: "1.0",
          userAgent: navigator.userAgent,
          platform: navigator.platform
        },
        profile: {
          basicInfo: {
            name: profile.name,
            email: profile.email,
            contactNumber: profile.contactNumber,
            role: profile.role,
            department: profile.department,
            joinDate: profile.joinDate
          },
          personalInfo: {
            address: profile.address,
            bio: profile.bio,
            emergencyContact: profile.emergencyContact,
            emergencyName: profile.emergencyName
          },
          avatar: profile.avatar ? {
            hasAvatar: true,
            size: profile.avatar.length,
            type: "base64_image"
          } : {
            hasAvatar: false
          }
        },
        preferences: {
          display: {
            theme: preferences.theme,
            language: preferences.language,
            timezone: preferences.timezone,
            dateFormat: preferences.dateFormat,
            timeFormat: preferences.timeFormat,
            dashboardView: preferences.dashboardView
          },
          notifications: preferences.notifications,
          system: {
            autoRefresh: preferences.autoRefresh,
            refreshInterval: preferences.refreshInterval
          }
        },
        statistics: {
          deliveriesManaged: stats.deliveriesManaged,
          thisWeek: stats.thisWeek,
          successRate: stats.successRate,
          pendingActions: stats.pendingActions,
          totalDrivers: stats.totalDrivers,
          activeVehicles: stats.activeVehicles
        },
        activityLog: activityLog.map(activity => ({
          action: activity.action,
          type: activity.type,
          timestamp: activity.time,
          timeAgo: getTimeAgo(activity.time)
        })),
        systemInfo: {
          localStorageUsage: (() => {
            let total = 0;
            for (let key in localStorage) {
              if (localStorage.hasOwnProperty(key)) {
                total += localStorage.getItem(key).length;
              }
            }
            return total;
          })(),
          dataCollected: new Date().toISOString(),
          retentionPeriod: "30 days for activity logs"
        }
      };

      console.log("Export data prepared:", allData);

      // Create formatted JSON
      const formattedJson = JSON.stringify(allData, null, 2);
      console.log("JSON formatted, length:", formattedJson.length);

      // Create and download file
      const blob = new Blob([formattedJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dms-profile-export-${new Date().toISOString().split('T')[0]}.json`;

      console.log("Download link created:", a.download);

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("Export completed successfully");

      addActivityLog("Profile data exported", "data");
      setMessage("✅ Profile data exported successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Export error:", error);
      setMessage("❌ Failed to export data: " + error.message);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (date, includeTime = false) => {
    try {
      const dateObj = new Date(date);

      // Format date according to preference
      let formattedDate = '';
      switch (preferences.dateFormat) {
        case 'DD/MM/YYYY':
          formattedDate = dateObj.toLocaleDateString('en-GB');
          break;
        case 'MM/DD/YYYY':
          formattedDate = dateObj.toLocaleDateString('en-US');
          break;
        case 'YYYY-MM-DD':
          formattedDate = dateObj.toISOString().split('T')[0];
          break;
        default:
          formattedDate = dateObj.toLocaleDateString();
      }

      if (includeTime) {
        // Format time according to preference
        let timeFormat = preferences.timeFormat === '12h' ? '12h' : '24h';
        formattedDate += ' ' + dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: timeFormat === '12h'
        });
      }

      return formattedDate;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (timestamp) => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffInSeconds = Math.floor((now - time) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

      // For older dates, use the formatted date
      return formatDate(time);
    } catch (error) {
      return 'Unknown time';
    }
  };

  const debugAvatarState = () => {
    console.log("=== AVATAR DEBUG INFO ===");
    console.log("tempAvatar:", tempAvatar ? "EXISTS (" + tempAvatar.length + " chars)" : "NULL");
    console.log("profile.avatar:", profile.avatar ? "EXISTS (" + profile.avatar.length + " chars)" : "NULL");
    console.log("Avatar format valid:", profile.avatar ? profile.avatar.startsWith('data:image/') : "N/A");

    console.log("localStorage profile:", (() => {
      try {
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const avatarSize = parsed.avatar ? parsed.avatar.length : 0;
          const avatarValid = parsed.avatar ? parsed.avatar.startsWith('data:image/') : true;
          return `avatar: ${parsed.avatar ? "EXISTS (" + avatarSize + " chars, valid: " + avatarValid + ")" : "NULL"}`;
        }
        return "NO STORED PROFILE";
      } catch (e) {
        return "ERROR: " + e.message;
      }
    })());

    // Check localStorage usage
    const storageInfo = (() => {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage.getItem(key).length;
        }
      }
      return total;
    })();
    console.log("localStorage usage:", Math.round(storageInfo / 1024), "KB");
    console.log("=========================");
  };

  const handleDeleteAccount = () => {
    // Clear all data
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    localStorage.removeItem('dms_activity_log_v1');
    setMessage("✅ Account deleted successfully. Refreshing...");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">

          {/* Header with Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {(() => {
                    console.log("Rendering avatar, tempAvatar:", tempAvatar ? "EXISTS" : "NULL");
                    console.log("Rendering avatar, profile.avatar:", profile.avatar ? "EXISTS" : "NULL");
                    console.log("Avatar condition check:", tempAvatar || profile.avatar);

                    if (tempAvatar || profile.avatar) {
                      const avatarSrc = tempAvatar || profile.avatar;
                      console.log("Using avatar source:", avatarSrc.substring(0, 50) + "...");
                      return (
                        <img
                          src={avatarSrc}
                          alt={profile.name}
                          className="w-full h-full rounded-2xl object-cover"
                          onError={(e) => {
                            console.error("Avatar image failed to load:", e);
                            setAvatarError("❌ Failed to load avatar image");
                            e.target.style.display = 'none';
                          }}
                        />
                      );
                    } else {
                      console.log("Using initials fallback");
                      return getInitials(profile.name);
                    }
                  })()}
                </div>
                {tempAvatar && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    Preview
                  </div>
                )}
                {avatarError && (
                  <div className="absolute -bottom-2 left-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full text-center">
                    {avatarError}
                  </div>
                )}
                <div className="absolute bottom-0 right-0 flex gap-2">
                  <label className="bg-green-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-green-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                  {tempAvatar && (
                    <button
                      onClick={cancelAvatarChange}
                      className="bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
                      title="Cancel avatar change"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {(profile.avatar || tempAvatar) && (
                    <button
                      onClick={removeAvatar}
                      className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors"
                      title="Remove avatar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                <p className="text-gray-600 mt-1">{profile.role} • {profile.department}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📧 {profile.email} • 📞 {profile.contactNumber}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(profile.joinDate)}
                </p>
                {profile.bio && (
                  <p className="text-gray-700 mt-3 max-w-2xl">{profile.bio}</p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{stats.deliveriesManaged}</div>
                  <div className="text-xs text-gray-600">Total Deliveries</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{stats.successRate}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{stats.pendingActions}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">{stats.totalDrivers}</div>
                  <div className="text-xs text-gray-600">Drivers</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-600">{stats.activeVehicles}</div>
                  <div className="text-xs text-gray-600">Vehicles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {[
                { id: "profile", label: "Profile", icon: "👤" },
                { id: "security", label: "Security", icon: "🔒" },
                { id: "preferences", label: "Preferences", icon: "⚙️" },
                { id: "activity", label: "Activity", icon: "📊" },
                { id: "data", label: "Data & Privacy", icon: "🗄️" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log("Switching to tab:", tab.id);
                    setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 flex-shrink-0 ${
                    activeTab === tab.id
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {message && (
                <div className={`p-4 mb-6 rounded-xl border flex items-center gap-2 transform transition-all duration-300 ease-in-out ${
                  message.includes("✅") ? "bg-green-50 text-green-800 border-green-200 translate-y-0 opacity-100" :
                  message.includes("🔄") ? "bg-blue-50 text-blue-800 border-blue-200 translate-y-0 opacity-100" :
                  "bg-red-50 text-red-800 border-red-200 translate-y-0 opacity-100"
                }`}>
                  {message.includes("🔄") && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  {message}
                </div>
              )}

              {avatarError && (
                <div className="p-4 mb-6 rounded-xl border bg-red-50 text-red-800 border-red-200 flex items-center gap-2 transform transition-all duration-300 ease-in-out">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {avatarError}
                </div>
              )}

              {/* Tab Content with Smooth Transitions */}
              <div className="transition-all duration-300 ease-in-out">
                {/* Profile Information Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Force reload profile from localStorage
                            window.location.reload();
                          }}
                          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          🔄 Reload Profile
                        </button>
                        <button
                          onClick={debugAvatarState}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          🔍 Debug Avatar
                        </button>
                        <button
                          onClick={exportData}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          📥 Export Data
                        </button>
                      </div>
                    </div>

                    <form onSubmit={saveProfile} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contactNumber"
                          value={profile.contactNumber}
                          onChange={handleProfileChange}
                          pattern="^\d{10}$"
                          title="Contact number must be exactly 10 digits"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Role
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={profile.role}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={profile.address}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="123 Main Street, Colombo 07"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="emergencyName"
                          value={profile.emergencyName}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Emergency Contact Number
                        </label>
                        <input
                          type="tel"
                          name="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={handleProfileChange}
                          pattern="^\d{10}$"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Tell us about yourself and your role..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {saving ? "Saving..." : "💾 Save Profile Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Change Password</h3>
                      <form onSubmit={changePassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwords.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="password"
                              name="confirmNewPassword"
                              value={passwords.confirmNewPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                          <p className="text-sm text-blue-900 font-medium mb-2">Password Requirements:</p>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• At least 8 characters long</li>
                            <li>• Contains uppercase and lowercase letters</li>
                            <li>• Contains at least one number</li>
                          </ul>
                        </div>

                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                        >
                          {saving ? "Updating..." : "🔒 Update Password"}
                        </button>
                      </form>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Danger Zone</h3>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h4 className="font-semibold text-red-800">Delete Account</h4>
                          <p className="text-red-600 text-sm">Permanently delete your account and all data</p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-xl font-semibold transition-all duration-200"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">System Preferences</h2>

                    {/* Notification Preferences */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                      <div className="space-y-4">
                        {Object.entries(preferences.notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-700 capitalize">{key} Notifications</span>
                              <p className="text-sm text-gray-500">Receive {key} notifications</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) => handlePreferenceChange("notifications", key, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Display Preferences */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                          <select
                            value={preferences.theme}
                            onChange={(e) => handlePreferenceChange("display", "theme", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="light">☀️ Light Mode</option>
                            <option value="dark">🌙 Dark Mode</option>
                            <option value="auto">🔄 Auto (System)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select
                            value={preferences.language}
                            onChange={(e) => handlePreferenceChange("display", "language", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="english">🇬🇧 English</option>
                            <option value="sinhala">🇱🇰 Sinhala</option>
                            <option value="tamil">🇱🇰 Tamil</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                          <select
                            value={preferences.timezone}
                            onChange={(e) => handlePreferenceChange("display", "timezone", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
                            <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                            <option value="UTC">UTC (GMT+0)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                          <select
                            value={preferences.dateFormat}
                            onChange={(e) => handlePreferenceChange("display", "dateFormat", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                          <select
                            value={preferences.timeFormat}
                            onChange={(e) => handlePreferenceChange("display", "timeFormat", e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Auto Refresh Interval (seconds)</label>
                          <input
                            type="number"
                            value={preferences.refreshInterval}
                            onChange={(e) => handlePreferenceChange("display", "refreshInterval", parseInt(e.target.value))}
                            min="10"
                            max="300"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={savePreferences}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "💾 Save Preferences"}
                    </button>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === "activity" && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            addActivityLog("Manual test activity", "general");
                            setMessage("✅ Test activity added");
                            setTimeout(() => setMessage(""), 2000);
                          }}
                          className="text-xs px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          + Add Test
                        </button>
                        <button
                          onClick={() => {
                            setActivityLog([]);
                            localStorage.removeItem('dms_activity_log_v1');
                            setMessage("✅ Activity log cleared");
                            setTimeout(() => setMessage(""), 3000);
                          }}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Clear History
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        try {
                          console.log("Rendering activity tab, activityLog length:", activityLog?.length || 0);
                          console.log("Activity log data:", activityLog);

                          if (!activityLog || activityLog.length === 0) {
                            return (
                              <div className="text-center py-12 text-gray-500">
                                <div className="text-4xl mb-2">📊</div>
                                <p>No activity yet</p>
                                <p className="text-sm mt-2">Activities will appear here as you use the system</p>
                                <button
                                  onClick={() => {
                                    const defaultActivities = [
                                      { action: "Profile created", time: new Date().toISOString(), type: "profile" },
                                      { action: "Preferences initialized", time: new Date(Date.now() - 3600000).toISOString(), type: "settings" },
                                      { action: "First login", time: new Date(Date.now() - 7200000).toISOString(), type: "security" }
                                    ];
                                    setActivityLog(defaultActivities);
                                    localStorage.setItem('dms_activity_log_v1', JSON.stringify(defaultActivities));
                                    setMessage("✅ Default activities loaded");
                                    setTimeout(() => setMessage(""), 2000);
                                  }}
                                  className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                                >
                                  Load Default Activities
                                </button>
                              </div>
                            );
                          }

                          return activityLog.map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                activity?.type === 'profile' ? 'bg-blue-500' :
                                activity?.type === 'security' ? 'bg-red-500' :
                                activity?.type === 'settings' ? 'bg-purple-500' :
                                activity?.type === 'data' ? 'bg-green-500' : 'bg-gray-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{activity?.action || 'Unknown action'}</p>
                                <p className="text-sm text-gray-500">{activity?.time ? getTimeAgo(activity.time) : 'Unknown time'}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                activity?.type === 'profile' ? 'bg-blue-100 text-blue-700' :
                                activity?.type === 'security' ? 'bg-red-100 text-red-700' :
                                activity?.type === 'settings' ? 'bg-purple-100 text-purple-700' :
                                activity?.type === 'data' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {activity?.type || 'general'}
                              </span>
                            </div>
                          ));
                        } catch (error) {
                          console.error("Error rendering activity tab:", error);
                          return (
                            <div className="text-center py-12 text-red-500">
                              <div className="text-4xl mb-2">⚠️</div>
                              <p>Error loading activities</p>
                              <p className="text-sm mt-2">Please refresh the page</p>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}

                {/* Data & Privacy Tab */}
                {activeTab === "data" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Data & Privacy</h2>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Export Your Data</h4>
                            <p className="text-sm text-gray-600">Download all your profile data in structured JSON format</p>
                          </div>
                          <button
                            onClick={exportData}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            📥 Export JSON
                          </button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">Clear Cache</h4>
                            <p className="text-sm text-gray-600">Clear temporary data and cached files</p>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.removeItem('dms_cache_v1');
                              setMessage("✅ Cache cleared");
                              setTimeout(() => setMessage(""), 3000);
                            }}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            🗑️ Clear
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">Privacy Information</h3>
                      <div className="space-y-3 text-sm text-blue-800">
                        <p>• Your data is stored locally in your browser</p>
                        <p>• We don't share your information with third parties</p>
                        <p>• You can export or delete your data at any time</p>
                        <p>• Activity logs are kept for 30 days</p>
                      </div>

                      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">📋 Exported Data Includes:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Profile information (name, email, role, etc.)</li>
                          <li>• System preferences and settings</li>
                          <li>• Dashboard statistics</li>
                          <li>• Activity history (last 20 actions)</li>
                          <li>• Export metadata (date, version, browser info)</li>
                        </ul>

                        <div className="mt-3 p-3 bg-white rounded border text-xs font-mono text-gray-700 overflow-x-auto">
                          <div className="text-blue-600 font-semibold mb-1">Sample JSON Structure:</div>
                          <div>{`{`}</div>
                          <div className="ml-2">{`"exportInfo": { "exportDate": "...", "version": "1.0" },`}</div>
                          <div className="ml-2">{`"profile": { "basicInfo": {...}, "personalInfo": {...} },`}</div>
                          <div className="ml-2">{`"preferences": { "display": {...}, "notifications": {...} },`}</div>
                          <div className="ml-2">{`"statistics": { "deliveriesManaged": 0, ... },`}</div>
                          <div className="ml-2">{`"activityLog": [ { "action": "Profile updated", ... } ]`}</div>
                          <div>{`}`}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Delete Account</h3>
              <p className="text-gray-700 mb-6">
                Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete:
              </p>
              <ul className="text-sm text-gray-600 mb-6 space-y-2">
                <li>• Your profile information</li>
                <li>• All preferences and settings</li>
                <li>• Activity history</li>
                <li>• All associated data</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
                >
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}