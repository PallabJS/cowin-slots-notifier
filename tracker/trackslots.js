import https from "https";
import { log } from "../settings.js";
import { sendSms } from "../Twilio/features/message.js";

// App functions
import { getNextDateFormatted } from "../functions/dateutils.js";
import { exec } from "child_process";

// Select district
// This is the only tested district_id
let district_id = 764; // district_id for 'Hojai'

// Change date here to check availability
// Date hardcoding (date to book for - tomorrow's date)
let startDate = "19-05-2021";

// setting date to check as tomorrow(comment to use hardcoded date)
startDate = getNextDateFormatted(1);

// This helps incrememting the date
let startDayCount = 0;

let notifiedBySms = false;
let phoneNumberToSms = process.env.PHONE_NUMBER;

export function startTracking() {
    log.info(`
            SMS     : ${phoneNumberToSms}
            DATE    : ${startDate}
        `);
    let loopId = setInterval(() => {
        // let date = getNextDateFormatted(startDayCount);

        // Date to check for
        let date = startDate;

        // startDayCount++;

        try {
            https.get(
                `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district_id}&date=+${date}`,
                (res) => {
                    let data = [];
                    res.on("data", (chunk) => {
                        data.push(chunk);
                    });
                    res.on("end", () => {
                        const cowinSessions = JSON.parse(Buffer.concat(data).toString());
                        let slots = getAllAvailableSlots(cowinSessions);
                        if (slots.length > 0) {
                            console.log("SLOTS AVAILABLE!!!");
                            clearInterval(loopId);

                            log.info(JSON.stringify(slots, null, 4));
                            log.info(`Check for date: ${date}} \n No slots available yet.`);

                            if (!notifiedBySms) {
                                notifiedBySms = true;
                                log.info(`Trying to send sms to ${phoneNumberToSms}`);
                                sendSms(phoneNumberToSms, `ALERT: Free slots are available now,go and book now!`);

                                // Play notification using default media player
                                exec("mplayer ./tracker/alert.mp3", (e) => log.error("Failed to play notification"));

                                log.debug("\n------------ Tracking Ended -------------");
                            }
                        } else {
                            log.info(`Checking for date: ${date} \n No slots available yet.`);
                        }
                    });
                }
            );
        } catch (error) {
            log.error(error);
        }
    }, 5000);
}

// Check slots availability
function getAllAvailableSlots(data) {
    let slots_available = [];
    for (let center of data.centers) {
        let session = center.sessions[0];
        if (session.min_age_limit === 18 && session.available_capacity > 0) {
            let slotData = {
                age: session.min_age_limit,
                date: session.date,
                address: center.name,
                block: center.block_name,
                SLOTS: session.available_capacity,
            };
            log.info("LOG: \n", slotData);
            slots_available.push(slotData);
        }
    }
    return slots_available;
}
