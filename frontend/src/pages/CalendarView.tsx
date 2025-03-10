// import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
// import "@ionic/react/css/flex-utils.css"; 
// import FullCalendar from "@fullcalendar/react";
// import timeGridPlugin from "@fullcalendar/timegrid";

// const CalendarView: React.FC = () => {
//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>My Calendar</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent>
//         <div style={{ padding: "10px" }}>
//           <FullCalendar
//             plugins={[timeGridPlugin]}
//             initialView="timeGridWeek"
//             height="auto"
//             slotMinTime="08:00:00" // Set the earliest time visible
//             slotMaxTime="20:00:00" // Set the latest time visible
//           />
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default CalendarView;

import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonProgressBar } from '@ionic/react';

const Dashboard: React.FC = () => {
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
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

