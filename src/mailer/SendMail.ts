import nodemailer from 'nodemailer';
const appMail = process.env.POD_GMAIL as string;
const appMailPassKey = process.env.POD_GMAIL_PASS as string;
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: appMail,
        pass: appMailPassKey,
    },
    tls: {
        rejectUnauthorized: false,
    },
});
export = {
    sendEmail(from: string, to: string, subject: string, html: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            transport.sendMail(
                { from, subject, to, html },
                (err, info) => {
                    if (err) reject(err);
                    resolve(info);
                },
            );
        });
    },
};
