// There's probably better ways to implement this conversion stuff lol 

// converts ion-range value to time-of-day string to be displayed on pin + label
export function stringTimeOfDay(rangeValue: number) : string {
  switch(rangeValue) {
    case 0:
      return "Morning";
    case 1:
      return "Noon";
    case 2:
      return "Afternoon";
    case 3:
      return "Evening";
    default: // 4
      return "Nighttime";
  }
}

// converts ion-range value to time-of-day string to be displayed on pin + label
export function stringFlexibility(rangeValue: number) : string {
  switch(rangeValue) {
    case 0:
      return "Very Rigid";
    case 1:
      return "Moderately Rigid";
    case 2:
      return "Neutral";
    case 3:
      return "Moderately Flexible";
    default: // 4
      return "Very Flexible";
  }
}