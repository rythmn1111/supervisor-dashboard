// utils/whatsappService.ts

interface SendNotificationParams {
    phoneNumber: string;
    complaintId: string;
    category: string;
    status: string;
  }
  
  export const sendWhatsAppNotification = async ({
    phoneNumber,
    complaintId,
    category,
    status
  }: SendNotificationParams): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WHATSAPP_API_URL}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          complaintId,
          category,
          status
        }),
      });
  
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      return false;
    }
  };