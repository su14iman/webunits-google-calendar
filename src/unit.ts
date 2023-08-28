import 'dotenv/config'
import { WebUntis } from 'webuntis';
import { EventAttributes } from 'ics'

import { createEventObj } from './tools/createEventObj';

export default async () =>{
    
    const events : EventAttributes[] = [];

    const untis = new WebUntis(
        process.env.UNTIS_SCHOOL,
        process.env.UNTIS_USERNAME,
        process.env.UNTIS_PASSWORD,
        process.env.UNTIS_URL
    );

    await untis.login();
    
    const curr = new Date;
    const first = curr.getDate() - curr.getDay();
    const last = first + parseInt(process.env.SETTINGS_LOAD_DAYS ?? "0");
    
    const firstday = new Date(curr.setDate(first)).toUTCString();
    const lastday = new Date(curr.setDate(last)).toUTCString();

    const timetableWeek = await untis.getOwnClassTimetableForRange(
        new Date(firstday),
        new Date(lastday)
    )
    timetableWeek.reverse();
    timetableWeek.forEach((data) => {
        events.push(
          createEventObj(
            {
              start: data.startTime.toString(),
              end: data.endTime.toString(),
              date: data.date.toString(),
              title: data.su[0].name + " - " + data.ro[0].name,
              description: data.kl[0].name + " - " + data.su[0].longname + " - " + data.te[0].longname,
              code: data.code ?? null
            }
          )
        )
    });

    return events;
};