import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import "@ionic/react/css/flex-utils.css"; 
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const CalendarView: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Calendar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ padding: "10px" }}>
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridWeek"
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
