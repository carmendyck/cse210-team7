import React, { useState, useEffect } from 'react';
import { fetchPreferences } from '../../../backend/src/controllers/fetchPrefController';
import { useAuth } from '../context/AuthContext';

export interface Preferences {
    most_productive_time: number | null;
    flexibility: number | null;
    work_duration: number;
    break_duration: number;
    selected_breaks: string[];
    user_id: string;
  }

const PreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const { uid } = useAuth();

  useEffect(() => {
    const loadPreferences = async () => {
      if (uid) {
        try {
          const fetchedPrefs = await fetchPreferences(uid);
          setPreferences(fetchedPrefs as Preferences);
        } catch (error) {
        }
      }
    };

    loadPreferences();
  }, [uid]);

  if (!preferences) {
    return <div>Loading preferences...</div>;
  }
};

export default PreferencesSettings;