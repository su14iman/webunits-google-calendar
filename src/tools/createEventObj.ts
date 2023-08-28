import * as ics from 'ics'

/**
 * to create an event for the ics file
 * @param data 
 * @param data.start start time
 * @param data.end end time
 * @param data.date date
 * @param data.title title
 * @param data.description description
 * @returns {ics.EventAttributes} event object
 */
const createEventObj = (data: {
    start: string,
    end: string,
    date: string,
    title: string,
    description: string,
    code?: string
  }) : ics.EventAttributes => {
    let startTime, endTime;
    
    startTime = data.start.toString();
    startTime.length < 4 ? startTime = "0" + startTime : startTime;
  
    endTime = data.end.toString();
    endTime.length < 4 ? endTime = "0" + endTime : endTime;
  
    return {
      title: data.code === "cancelled" ? "AG: "+data.title : data.title, // title
      description: data.description, // description
      busyStatus: 'BUSY',
      start: [
        parseInt(data.date.slice(0, 4)), // year
        parseInt(data.date.slice(4, 6)), // month
        parseInt(data.date.slice(6, 8)), // day
        parseInt(startTime.slice(0, 2)), // hours
        parseInt(startTime.slice(2, 4)) // minutes
      ],
      duration: { 
        minutes: (parseInt(endTime.slice(0, 2)) * 60 + parseInt(endTime.slice(2, 4))) 
        - (parseInt(startTime.slice(0, 2)) * 60 + parseInt(startTime.slice(2, 4))) 
      }
    };
    
  };

  export { createEventObj };