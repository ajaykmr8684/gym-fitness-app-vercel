const isMobileDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
};

const openUrl = (url: string) => {
  window.open(url, '_blank');
};

const buildGmailUrl = (to: string, subject: string, body: string): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  if (isMobileDevice()) {
    // Try Gmail app deep link first; fallback to default mail client
    return `googlegmail://co?to=${encodeURIComponent(to)}&subject=${encodedSubject}&body=${encodedBody}`;
  }

  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodedSubject}&body=${encodedBody}`;
};

const buildMailtoUrl = (to: string, subject: string, body: string): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${encodeURIComponent(to)}?subject=${encodedSubject}&body=${encodedBody}`;
};

const buildWhatsAppUrl = (phone: string, message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  if (isMobileDevice()) {
    return `whatsapp://send?phone=${phone}&text=${encodedMessage}`;
  }

  return `https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
};

const normalizeIndianPhone = (phone: string): string => {
  let normalized = phone.replace(/\D/g, '');
  if (!normalized.startsWith('91')) {
    normalized = `91${normalized}`;
  }
  return normalized;
};

const launchUrl = (url: string, fallbackUrl?: string) => {
  try {
    openUrl(url);
  } catch (err) {
    if (fallbackUrl) {
      openUrl(fallbackUrl);
    } else {
      throw err;
    }
  }
};

export const sendBillEmail = async (
  memberEmail: string,
  memberName: string,
  billAmount: number,
  billDate: string,
  dueDate: string
): Promise<boolean> => {
  try {
    const subject = 'Your Gym Bill - Shree Ram Fitness Centre';
    const body = `Hello ${memberName},\n\nYour gym billing statement has been generated.\n\nBill Details:\nBill Date: ${billDate}\nDue Date: ${dueDate}\nAmount Due: ₹${billAmount}\n\nPlease make the payment by the due date to keep your membership active.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nShree Ram Fitness Centre\nEmail: shreeramfitnesshamirpur@gmail.com\nPhone: +91-8580521298`;

    const gmailUrl = buildGmailUrl(memberEmail, subject, body);
    const mailtoUrl = buildMailtoUrl(memberEmail, subject, body);

    launchUrl(gmailUrl, mailtoUrl);
    return true;
  } catch (error) {
    console.error('Error opening email:', error);
    alert('Could not open email composer. Please make sure your email app is available.');
    return false;
  }
};

export const sendBillWhatsApp = async (
  memberPhone: string,
  memberName: string,
  billAmount: number,
  dueDate: string
): Promise<boolean> => {
  try {
    const phone = normalizeIndianPhone(memberPhone);
    const message = `Hi ${memberName},\n\nYour gym bill of ₹${billAmount} is due on ${dueDate}.\n\nPlease make the payment to keep your membership active.\n\nThank you!\nShree Ram Fitness Centre`;
    const whatsappUrl = buildWhatsAppUrl(phone, message);
    const fallbackUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

    launchUrl(whatsappUrl, fallbackUrl);
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    alert('Could not open WhatsApp. Please make sure WhatsApp is installed or WhatsApp Web is available.');
    return false;
  }
};

export const sendReminderEmail = async (
  memberEmail: string,
  memberName: string,
  reminderType: string,
  message: string
): Promise<boolean> => {
  try {
    const subject = `${reminderType} - Shree Ram Fitness Centre`;
    const body = `Hello ${memberName},\n\n${message}\n\nIf you have any questions, please contact us.\n\nBest regards,\nShree Ram Fitness Centre\nEmail: shreeramfitnesshamirpur@gmail.com\nPhone: +91-8580521298`;

    const gmailUrl = buildGmailUrl(memberEmail, subject, body);
    const mailtoUrl = buildMailtoUrl(memberEmail, subject, body);

    launchUrl(gmailUrl, mailtoUrl);
    return true;
  } catch (error) {
    console.error('Error opening email:', error);
    alert('Could not open email composer. Please make sure your email app is available.');
    return false;
  }
};

export const sendReminderWhatsApp = async (
  memberPhone: string,
  memberName: string,
  message: string
): Promise<boolean> => {
  try {
    const phone = normalizeIndianPhone(memberPhone);
    const fullMessage = `Hi ${memberName}, ${message}\n\nShree Ram Fitness Centre`;
    const whatsappUrl = buildWhatsAppUrl(phone, fullMessage);
    const fallbackUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(fullMessage)}`;

    launchUrl(whatsappUrl, fallbackUrl);
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    alert('Could not open WhatsApp. Please make sure WhatsApp is installed or WhatsApp Web is available.');
    return false;
  }
};
