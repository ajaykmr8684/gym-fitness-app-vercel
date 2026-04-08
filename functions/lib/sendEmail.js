"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendReminderEmail = exports.sendBillEmail = void 0;
const functions = __importStar(require("firebase-functions"));
const sgMail = __importStar(require("@sendgrid/mail"));
// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
exports.sendBillEmail = functions.https.onCall(async (data, context) => {
    try {
        const { memberEmail, memberName, billAmount, billDate, dueDate } = data;
        // Validate inputs
        if (!memberEmail || !memberName || !billAmount) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: memberEmail, memberName, billAmount');
        }
        const msg = {
            to: memberEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'shreeramfitnesshamirpur@gmail.com',
            subject: `Your Gym Bill - Shree Ram Fitness Centre`,
            html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }
              .header { background: #0f172a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
              .header h1 { margin: 0; font-size: 24px; }
              .content { background: white; padding: 20px; }
              .bill-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .bill-table td { padding: 10px; border: 1px solid #ddd; }
              .bill-table tr:nth-child(even) { background: #f9f9f9; }
              .amount { font-weight: bold; font-size: 18px; color: #0ea5e9; }
              .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Shree Ram Fitness Centre</h1>
                <p>Your Membership Bill</p>
              </div>
              <div class="content">
                <p>Hello ${memberName},</p>
                <p>Your gym billing statement has been generated. Please find the details below:</p>
                
                <table class="bill-table">
                  <tr>
                    <td><strong>Bill Date:</strong></td>
                    <td>${billDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Due Date:</strong></td>
                    <td>${dueDate}</td>
                  </tr>
                  <tr>
                    <td><strong>Amount Due:</strong></td>
                    <td class="amount">₹${billAmount}</td>
                  </tr>
                </table>

                <p>Please make the payment by the due date to keep your membership active.</p>
                <p>If you have any questions or concerns, please don't hesitate to contact us.</p>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>Shree Ram Fitness Centre</strong></p>
              </div>
              <div class="footer">
                <p>Email: shreeramfitnesshamirpur@gmail.com | Phone: +91-8580521298</p>
                <p>This is an automated email. Please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };
        await sgMail.send(msg);
        return { success: true, message: 'Email sent successfully' };
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new functions.https.HttpsError('internal', `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
exports.sendReminderEmail = functions.https.onCall(async (data, context) => {
    try {
        const { memberEmail, memberName, reminderType, message } = data;
        if (!memberEmail || !memberName) {
            throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: memberEmail, memberName');
        }
        const msg = {
            to: memberEmail,
            from: process.env.SENDGRID_FROM_EMAIL || 'shreeramfitnesshamirpur@gmail.com',
            subject: `Reminder - Shree Ram Fitness Centre`,
            html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Hello ${memberName},</h2>
              <div class="alert">
                <p>${message}</p>
              </div>
              <p>If you have any questions, please contact us at shreeramfitnesshamirpur@gmail.com or +91-8580521298</p>
              <p>Best regards,<br>Shree Ram Fitness Centre</p>
            </div>
          </body>
        </html>
      `,
        };
        await sgMail.send(msg);
        return { success: true, message: 'Reminder email sent successfully' };
    }
    catch (error) {
        console.error('Error sending reminder email:', error);
        throw new functions.https.HttpsError('internal', `Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
//# sourceMappingURL=sendEmail.js.map