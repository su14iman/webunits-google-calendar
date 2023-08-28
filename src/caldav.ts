import { DAVClient, DAVCalendar, DAVCalendarObject } from 'tsdav';
import * as ics from 'ics'

/**
 * CalDAV class
 * @class CalDAV
 * @property {DAVClient} client
 * @property {ics.EventAttributes[]} events
 * @method {Promise<void>} login
 * @method {Promise<DAVCalendar[]>} calendars
 * @method {Promise<DAVCalendar | null>} myCalendar
 * @method {Promise<DAVCalendarObject[]>} calendarObjects
 * @method {Promise<ics.EventAttributes[]>} filteredEvent
 * @method {string} icsEvent
 * @method {Promise<any>} createCalendarObject
 * @method {Promise<void>} createCalendarObjects
 */
export default class CalDAV{
    
    private client: DAVClient;
    private events: ics.EventAttributes[] = [];

    constructor(){
        this.client = new DAVClient({
            serverUrl: 'https://apidata.googleusercontent.com/caldav/v2/',
            credentials: {
              tokenUrl: process.env.GOOGLE_TOKEN_URI,
              username: process.env.GOOGLE_USERNAME,
              refreshToken: process.env.GOOGLE_REFRESHTOKEN,
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
            authMethod: 'Oauth',
            defaultAccountType: 'caldav',
        });
    }

    /**
     * to set the events
     * @param {ics.EventAttributes[]} events
     */
    public set eventsList(events: ics.EventAttributes[]){
        this.events = events;
    }

    /**
     * to login to the server
     * @returns {Promise<void>}
     */
    public async login() : Promise<void>{
        await this.client.login();
    }

    /**
     * to fetch all calendars
     * @returns {Promise<DAVCalendar[]>}
     */
    public async calendars(): Promise<DAVCalendar[]>{
        return await this.client.fetchCalendars();
    }

    /**
     * return from array just the calendar with the name "{GOOGLE_PUBLIC_CALENDAR_NAME}"
     * @returns {Promise<DAVCalendar | null>}
     */
    public async myCalendar() : Promise< DAVCalendar | null >{
        const calendars = await this.calendars();
        return calendars.filter((calendar) => {
            return calendar.displayName ===  process.env.GOOGLE_PUBLIC_CALENDAR_NAME.toString();
        })[0] ?? null;
    }

    /**
     * to fetch all events from the calendar
     * @param {DAVCalendar?} calendar 
     * @returns {Promise<DAVCalendarObject[]>}
     */
    public async calendarObjects(calendar?: DAVCalendar): Promise<DAVCalendarObject[]>{
        return await this.client.fetchCalendarObjects({
            calendar: calendar ? calendar : await this.myCalendar(),
        });
    }

    /**
     * to compare the events and remove the duplicates
     * compare the title and the start time
     * @param {ics.EventAttributes[]?} events 
     * @param {DAVCalendarObject[]?} calendarObjects 
     * @returns {Promise<ics.EventAttributes[]>}
     */
    public async filteredEvent(events?: ics.EventAttributes[], calendarObjects?:DAVCalendarObject[]) : Promise<ics.EventAttributes[]>{
        events = events ? events : this.events;
        calendarObjects = calendarObjects ? calendarObjects : await this.calendarObjects();
        // item[7] = startTime, item[17] = title(summary)
        return events.filter((event) => {
            return calendarObjects.filter((calendarObject) => {
              let item = calendarObject.data.toString().split("\n");
              return item[7].split(":")[1] === new Date(
                `${event.start[0]}-${event.start[1]}-${event.start[2]} ${event.start[3]}:${event.start[4]}:00`
              ).toISOString().replace(/-|:|\.\d\d\d/g,"") &&
              item[17].split(":")[1] === event.title
              ;
            }).length === 0;
        });
    }

    /**
     * to create a calendar object ICS
     * @param {ics.EventAttributes} event 
     * @returns {Promise<string>}
     */
    private icsEvent(event: ics.EventAttributes) : string{
        return ics.createEvent(event).value.toString();
    }

    /**
     * to create a calendar object
     * @param {ics.EventAttributes} event
     * @param {DAVCalendar?} calendar
     * @param {string?} filename
     * @returns {Promise<any>}
     */
    public async createCalendarObject(event: ics.EventAttributes, calendar?: DAVCalendar, filename?: string) : Promise<any>{
        return await this.client.createCalendarObject({
            calendar: calendar ? calendar : await this.myCalendar(),
            filename: filename ? filename : 'unit.ics',
            iCalString: this.icsEvent(event),
        });
    }

    /**
     * to create all calendar objects from the filtered events or specific events array
     * @param {ics.EventAttributes[]} events 
     * @param {DAVCalendar?} calendar 
     * @param {string?} filename 
     */
    public async createCalendarObjects(events?: ics.EventAttributes[], calendar?: DAVCalendar, filename?: string) : Promise<void>{
        events = events ? events : await this.filteredEvent();
        events.forEach( async (event) => {
            await this.createCalendarObject(event, calendar, filename);
        });
    }

}