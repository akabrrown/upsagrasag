import webpush from 'web-push';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

// Initialize web-push safely (to avoid crashing during build when env vars might be missing)
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:Grasagupsa2026@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
} else {
  console.warn('VAPID keys not set, skipping web-push initialization during build.');
}

export async function sendPushNotificationToAll(title: string, body: string, url: string = '/') {
  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn('VAPID keys not configured, skipping push notifications.');
    return;
  }

  try {
    // 1. Fetch all subscriptions from the database
    const { data: subscriptions, error } = await supabaseAdminClient
      .from('push_subscriptions')
      .select('*');

    if (error) {
      console.error('Error fetching push subscriptions:', error);
      return;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return; // No one to notify
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
      icon: '/favicon.png' // Ensure you have this icon in public/
    });

    // 2. Send the push notification to all subscriptions in parallel
    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        // If the subscription is no longer valid (e.g., user revoked permission or wrong VAPID), remove it
        if (err.statusCode === 404 || err.statusCode === 410 || err.statusCode === 403) {
          await supabaseAdminClient
            .from('push_subscriptions')
            .delete()
            .eq('id', sub.id);
        } else {
          console.error('Error sending push notification to endpoint', sub.endpoint, err);
        }
      }
    });

    await Promise.all(sendPromises);
  } catch (error) {
    console.error('Failed to send push notifications:', error);
  }
}
