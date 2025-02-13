import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "@ionic/react/css/flex-utils.css"; // Ensure Ionic utilities are available
import FullCalendar from "@fullcalendar/react"; // FullCalendar library
import timeGridPlugin from "@fullcalendar/timegrid"; // Weekly & daily views

const CalendarView: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Weekly Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: "10px" }}>
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek" // 👈 This sets the weekly view
            height="auto"
            slotMinTime="08:00:00" // Set the earliest time visible
            slotMaxTime="20:00:00" // Set the latest time visible
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CalendarView;
