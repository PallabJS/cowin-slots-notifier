import { sid, token, phoneNumber, log } from "../../settings.js";

// Twilio client
import twilio from "twilio";

export function sendSms(to, body) {
    try {
        const client = twilio(sid, token);

        if (Array.isArray(to)) {
            to.forEach((number) => {
                client.messages
                    .create({
                        body: body,
                        from: phoneNumber,
                        to: number,
                    })
                    .then((res) => {
                        log.info(JSON.stringify(res, null, 4));
                    })
                    .catch((e) => {
                        log.error(e.message);
                    });
            });
        } else {
            client.messages
                .create({
                    body: body,
                    from: phoneNumber,
                    to: to,
                })
                .then((res) => {
                    log.info(JSON.stringify(res, null, 4));
                })
                .catch((e) => {
                    log.error(e.message);
                });
        }
    } catch (e) {
        log.error(e.message);
    }
}
