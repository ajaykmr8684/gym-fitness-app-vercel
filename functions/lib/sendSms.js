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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBillSms = void 0;
const functions = __importStar(require("firebase-functions"));
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const fromNumber = process.env.TWILIO_FROM_NUMBER || '';
if (!accountSid || !authToken || !fromNumber) {
    console.warn('Twilio environment variables are not fully configured. sendBillSms will fail until they are set.');
}
const client = (0, twilio_1.default)(accountSid, authToken);
const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/[^+0-9]/g, '');
    if (cleaned.startsWith('00')) {
        cleaned = `+${cleaned.slice(2)}`;
    }
    if (!cleaned.startsWith('+')) {
        if (cleaned.startsWith('91')) {
            cleaned = `+${cleaned}`;
        }
        else {
            cleaned = `+91${cleaned}`;
        }
    }
    return cleaned;
};
exports.sendBillSms = functions.https.onCall(async (data, context) => {
    try {
        const { memberPhone, memberName, billAmount, planType } = data;
        if (!memberPhone || !memberName || typeof billAmount !== 'number') {
            throw new functions.https.HttpsError('invalid-argument', 'memberPhone, memberName and billAmount are required.');
        }
        if (!accountSid || !authToken || !fromNumber) {
            throw new functions.https.HttpsError('failed-precondition', 'Twilio is not configured on the backend.');
        }
        const to = formatPhoneNumber(memberPhone);
        const planLabel = planType ? `${planType} membership` : 'membership';
        const body = `Hi ${memberName}, your ${planLabel} payment of ₹${billAmount} is confirmed. Thank you for choosing Shri Ram Fitness.`;
        await client.messages.create({
            body,
            from: fromNumber,
            to,
        });
        return { success: true, message: 'SMS sent successfully' };
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        throw new functions.https.HttpsError('internal', `SMS sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
});
//# sourceMappingURL=sendSms.js.map