const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer Transporter
 */
function getTransporter() {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
    const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

    if (!user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587
        auth: {
            user,
            pass
        }
    });
}

/**
 * Generate Responsive HTML Email Template for OTP
 */
function buildOtpEmailHtml({ username, otp }) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PrepAI Password Reset Verification</title>
        <style>
            body { margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
            .container { max-width: 540px; margin: 40px auto; background-color: #0f172a; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
            .header { padding: 32px 32px 24px 32px; text-align: center; background: linear-gradient(180deg, rgba(236, 72, 153, 0.1) 0%, transparent 100%); }
            .logo { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; }
            .gradient-text { color: #ec4899; }
            .content { padding: 0 32px 32px 32px; }
            h2 { color: #ffffff; font-size: 20px; margin-top: 0; font-weight: 700; text-align: center; }
            p { color: #94a3b8; font-size: 15px; line-height: 1.6; margin: 12px 0; }
            .otp-box { text-align: center; margin: 28px 0; padding: 20px; background: #131c31; border: 1px dashed rgba(236, 72, 153, 0.4); border-radius: 12px; }
            .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #f472b6; }
            .expiry { font-size: 13px; color: #cbd5e1; margin-top: 8px; font-weight: 500; }
            .warning { background: rgba(245, 158, 11, 0.1); border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 24px 0; font-size: 13px; color: #fcd34d; line-height: 1.5; }
            .footer { padding: 24px 32px; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center; font-size: 12px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Prep<span class="gradient-text">AI</span></div>
            </div>
            <div class="content">
                <h2>Password Reset Request</h2>
                <p>Hello ${username || "there"},</p>
                <p>We received a request to reset the password for your PrepAI account. Use the verification code below to complete the process:</p>
                
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <div class="expiry">This verification code expires in <strong>10 minutes</strong>.</div>
                </div>

                <div class="warning">
                    <strong>Security Notice:</strong> If you did not request a password reset, please ignore this email or change your password if you suspect unauthorized access.
                </div>

                <p>Best regards,<br>The PrepAI Security Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} PrepAI Platform. All rights reserved.<br>
                This is an automated notification. Please do not reply directly to this email.
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Send Password Reset OTP Email
 */
async function sendPasswordResetEmail({ toEmail, username, otp }) {
    const transporter = getTransporter();
    const fromAddress = process.env.EMAIL_FROM || `"PrepAI Security" <${process.env.SMTP_USER || "no-reply@prepai.com"}>`;

    if (!transporter) {
        console.log(`
================================================================================
📨 [DEV EMAIL DISPATCH] (SMTP credentials not yet configured in .env)
To:       ${toEmail}
Subject:  PrepAI Password Reset Verification Code
Code:     ${otp} (Valid for 10 minutes)
Note:     To deliver real emails to inbox, add SMTP_USER & SMTP_PASS in .env
================================================================================
        `);
        return { sent: true, simulated: true };
    }

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to: toEmail,
            subject: "Your PrepAI Password Reset Code",
            text: `Your PrepAI password reset verification code is: ${otp}. It will expire in 10 minutes.`,
            html: buildOtpEmailHtml({ username, otp })
        });

        console.log(`✅ [EMAIL SENT] Successfully dispatched to ${toEmail} (Message ID: ${info.messageId})`);
        return { sent: true, messageId: info.messageId };

    } catch (error) {
        console.error(`❌ [EMAIL ERROR] Failed to send email to ${toEmail}:`, error.message);
        // Fallback log so testing is never blocked
        console.log(`[BACKUP OTP LOG] Code for ${toEmail}: ${otp}`);
        return { sent: false, error: error.message };
    }
}

module.exports = {
    sendPasswordResetEmail
};

