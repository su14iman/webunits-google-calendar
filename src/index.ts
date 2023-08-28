import 'dotenv/config'

import Unit from './unit';
import CalDAV from './caldav';


const main = async () => {
    
  const caldav = new CalDAV();
  caldav.eventsList = await Unit();
  await caldav.login()
  .then(
    async () => await caldav.createCalendarObjects()
  )
  .catch(err => console.error(err));

};



main()
.then()
.catch(err => console.error(err));