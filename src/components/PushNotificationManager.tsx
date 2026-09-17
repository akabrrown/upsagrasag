'use client';

import { useEffect, useState } from 'react';

// Helper function to convert the VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorkerAndSubscribe();
    }
  }, []);

  async function registerServiceWorkerAndSubscribe() {
    try {
      // 1. Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      // Ensure the service worker is ready
      await navigator.serviceWorker.ready;

      // 2. Ask for permission (will prompt the user)
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Push notification permission denied.');
        return;
      }

      // 3. Subscribe the user
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        // Already subscribed, we can still send to backend to ensure it's saved
        await sendSubscriptionToBackend(existingSubscription);
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.warn('VAPID public key not found.');
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // 4. Send subscription to our backend
      await sendSubscriptionToBackend(newSubscription);
    } catch (error) {
      console.error('Error during push notification setup:', error);
    }
  }

  async function sendSubscriptionToBackend(subscription: PushSubscription) {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
    } catch (error) {
      console.error('Error saving subscription to backend:', error);
    }
  }

  // This is a background manager, so it renders nothing.
  return null;
}
