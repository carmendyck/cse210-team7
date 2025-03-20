import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonProgressBar, IonModal, IonButton } from '@ionic/react';
import './CalendarView.css';
import { useAuth } from "../context/AuthContext";

interface Task {
  total_time_estimate: number;
}

interface DashboardProps {
  task: Task | null;
  timer: number;
}

const Dashboard: React.FC<DashboardProps> = ({ task, timer }) => {

  const totalTimeWorked = "6 hr 18 min";
  const workPercentage = 0.79;
  const focusPercentage = 0.62;
  const classPercentage = 0.15;
  const breaksPercentage = 0.11;
  const otherPercentage = 0.12;
  const topCategories = [
    { name: "CSE 210", percentage: 0.59, time: "3 hr 44 min" },
    { name: "CSE 291", percentage: 0.12, time: "45 min" },
    { name: "CSE 251A", percentage: 0.10, time: "37 min" }
  ];

  const ucsdNavy = '#003366';
  const ucsdGold = '#FFCD00';
  const ucsdLightBlue = '#ADD8E6';
  const ucsdGray = '#D3D3D3';
  
  const allBreakTypes = [
    { key: "Water Break", title: "💧 Water Break", message: "Stay hydrated! Drink a glass of water." },
    { key: "Snack Break", title: "🍎 Snack Break", message: "Grab a healthy snack and recharge." },
    { key: "Active Break", title: "🏃 Active Break", message: "Stretch or take a short walk to refresh your mind." },
    { key: "Meditation Break", title: "🧘 Meditation Break", message: "Take a deep breath and relax for a moment." }
  ];
  
  
  
  
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [currentBreak, setCurrentBreak] = useState(allBreakTypes[0]);

  const [breakDuration, setBreakDuration] = useState(5);
  const [workDuration, setWorkDuration] = useState(30);
  const [selectedBreaks, setSelectedBreaks] = useState<Record<string, boolean>>({});
  const { uid } = useAuth();  // Get user ID from auth context

  useEffect(() => {
    if (uid) {
      const fetchPreferences = async () => {
        try {
          const response = await fetch(`http://localhost:5050/api/breaks/getBreaks?user_id=${uid}`);
          if (!response.ok) throw new Error("Failed to fetch preferences");
          const data = await response.json();

          setWorkDuration(data.work_duration ?? 30);
          setBreakDuration(data.break_duration ?? 5);
          setSelectedBreaks(data.selected_breaks ?? {
            "Water Break": true,
            "Snack Break": true,
            "Active Break": true,
            "Meditation Break": true,
          });
        } catch (error) {
          console.error("Error loading preferences:", error);
        }
      };

      fetchPreferences();
    }
  }, [uid]);

  const [filteredBreaks, setFilteredBreaks] = useState<any[]>([]);

  useEffect(() => {
    const newFilteredBreaks = allBreakTypes.filter(breakItem => selectedBreaks[breakItem.key]);
    setFilteredBreaks(newFilteredBreaks);
  }, [selectedBreaks]);


  useEffect(() => {
    if (filteredBreaks.length === 0) return; // Prevent modal if no breaks are selected
  
    const breakInterval = breakDuration * 60000; // Convert minutes to milliseconds
  
    const timer = setInterval(() => {
      const randomBreak = filteredBreaks[Math.floor(Math.random() * filteredBreaks.length)];
      setCurrentBreak(randomBreak);
      setShowModal(true);
    }, breakInterval);
  
    return () => clearInterval(timer);
  }, [filteredBreaks, breakDuration]);

  useEffect(() => {
    if (timer >= workDuration * 3600) {
      setShowModal(true);
    }
  }, [timer, workDuration]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (showModal) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(interval as NodeJS.Timeout); // Clear interval when countdown reaches 0
            setShowModal(false); // close the modal when the timer ends
            return 0;
          }
          return prevCountdown - 1; // Decrement countdown every second
        });
      }, 1000);
    } else {
      setCountdown(breakDuration * 60); // Reset countdown when modal is closed
    }});
  
  

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': ucsdNavy, '--color': ucsdGold }}>
          <IonTitle className="header-title" style={{ color: ucsdGold }}>Daily Summary</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding dashboard-content" style={{ '--background': '#F0F8FF' }}>
        <IonCard className="summary-card" style={{ '--background': 'white' }}>
          <IonCardContent>
            <p className="summary-text" style={{ color: '#333' }}>Today, you spent <strong> 20% more time focusing </strong> than usual, you closed <strong>2 tasks</strong> on for CSE 210 and CSE 291, but the break time was <strong>15%</strong> higher than yesterday.</p>
          </IonCardContent>
        </IonCard>
      <IonCard className="info-card" style={{ '--background': 'white' }}>
          <IonCardContent>
            <h2 style={{ color: ucsdNavy }}>Total time worked</h2>
            <p className="highlight-text" style={{ color: ucsdNavy }}>{totalTimeWorked}</p>
            <h2 style={{ color: ucsdNavy }}>Percent of work day</h2>
            <IonProgressBar className="progress-bar" value={workPercentage} style={{ '--progress-background': ucsdGold }}></IonProgressBar>
            <p className="highlight-text" style={{ color: ucsdNavy }}>{(workPercentage * 100).toFixed(0)}% of 8 hr 0 min</p>
          </IonCardContent>
        </IonCard>

        <IonCard className="info-card" style={{ '--background': 'white' }}>
          <IonCardContent>
            <h2 style={{ color: ucsdNavy }}>Activity Breakdown</h2>
            <div className="activity-container">
              <p style={{ color: '#333' }}>Focus: <span className="highlight-text" style={{ color: ucsdNavy }}>{(focusPercentage * 100).toFixed(0)}%</span></p>
              <IonProgressBar className="progress-bar" value={focusPercentage} style={{ '--progress-background': ucsdNavy }}></IonProgressBar>
              <p style={{ color: '#333' }}>Class time: <span className="highlight-text" style={{ color: ucsdNavy }}>{(classPercentage * 100).toFixed(0)}%</span></p>
              <IonProgressBar className="progress-bar" value={classPercentage} style={{ '--progress-background': ucsdLightBlue }}></IonProgressBar>
              <p style={{ color: '#333' }}>Breaks: <span className="highlight-text" style={{ color: ucsdNavy }}>{(breaksPercentage * 100).toFixed(0)}%</span></p>
              <IonProgressBar className="progress-bar" value={breaksPercentage} style={{ '--progress-background': ucsdGray }}></IonProgressBar>
              <p style={{ color: '#333' }}>Other: <span className="highlight-text" style={{ color: ucsdNavy }}>{(otherPercentage * 100).toFixed(0)}%</span></p>
              <IonProgressBar className="progress-bar" value={otherPercentage} style={{ '--progress-background': '#C0C0C0' }}></IonProgressBar>
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard className="info-card" style={{ '--background': 'white' }}>
          <IonCardContent>
            <h2 style={{ color: ucsdNavy }}>Top Categories</h2>
            {topCategories.map((category, index) => (
              <div key={index} className="category-container">
                <p style={{ color: '#333' }}>{category.name}: <span className="highlight-text" style={{ color: ucsdNavy }}>{(category.percentage * 100).toFixed(0)}% ({category.time})</span></p>
                <IonProgressBar className="progress-bar" value={category.percentage} style={{ '--progress-background': ucsdGold }}></IonProgressBar>
              </div>
            ))}
          </IonCardContent>
        </IonCard>

        <IonModal isOpen={showModal} backdropDismiss={false}>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h2>{currentBreak?.title}</h2>
            <p>{currentBreak?.message}</p>
            <h3 style={{ fontSize: '2rem', color: ucsdNavy }}>{formatTime(countdown)}</h3>
            <IonButton onClick={() => setShowModal(false)} color="warning">Dismiss</IonButton>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;