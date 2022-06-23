export const convertTime12to24 = (time12h) => {
    const modifier = time12h.substr(time12h.length-2);
    const time = time12h.substr(0,time12h.length-2);
  
    let [hours, minutes] = time.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
  
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
}