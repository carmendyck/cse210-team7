import { useState } from 'react';

const fetchPreferences = async (uid: string, setWorkDuration: React.Dispatch<React.SetStateAction<number>>, setBreakDuration: React.Dispatch<React.SetStateAction<number>>, setSelectedBreaks: React.Dispatch<React.SetStateAction<Record<string, boolean>>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setIsLoading(true);  // Start loading
    const response = await fetch(`http://localhost:5050/api/breaks/getBreaks?user_id=${uid}`);
    
    if (!response.ok) {
      console.error("Failed to fetch preferences");
      return;
    }

    const data = await response.json();

    setWorkDuration(data.work_duration || 30); // Default to 30 if not provided
    setBreakDuration(data.break_duration || 5);  // Default to 5 if not provided
    setSelectedBreaks(data.selected_breaks || {
      "Water Break": true,
      "Snack Break": true,
      "Active Break": true,
      "Meditation Break": true
    });

  } catch (error) {
    console.error("Error loading preferences:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
};

const fetchNotificationPreferences = async (
  uid: string, 
  setLockScreen: React.Dispatch<React.SetStateAction<boolean>>, 
  setInApp: React.Dispatch<React.SetStateAction<boolean>>, 
  setEmail: React.Dispatch<React.SetStateAction<boolean>>, 
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setIsLoading(true);
    const response = await fetch(`http://localhost:5050/api/notifications/getPreferences?user_id=${uid}`);
    
    if (!response.ok) {
      console.error("Failed to fetch notification preferences");
      return;
    }

    const data = await response.json();
    setLockScreen(data.lock_screen ?? true);
    setInApp(data.in_app ?? true);
    setEmail(data.email ?? true);
  } catch (error) {
    console.error("Error loading notification preferences:", error);
  } finally {
    setIsLoading(false);
  }
};
