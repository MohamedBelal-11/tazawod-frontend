import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz';

const date = new Date('2024-07-06T12:00:00Z'); // UTC time
const timeZone = 'America/New_York';

const zonedDate = utcToZonedTime(date, timeZone);

const pattern = 'yyyy-MM-dd HH:mm:ssXXX';
const output = format(zonedDate, pattern, { timeZone });

console.log(output); // Output will be in the specified time zone