'use client';

import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useRouter, usePathname } from 'next/navigation';

export default function CapacitorClient() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Handle Android Hardware Back Button
    const backListener = CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (pathname === '/') {
        CapacitorApp.exitApp();
      } else if (canGoBack) {
        router.back();
      } else {
        CapacitorApp.exitApp();
      }
    });

    // 2. Configure Status Bar (Make it transparent so app goes under the notch)
    const setupStatusBar = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Light }); // Dark text for light background
        await StatusBar.setOverlaysWebView({ overlay: true });
      } catch (e) {
        // Fallback for web mode where plugin isn't available
        console.log("Status bar customization not available");
      }
    };

    setupStatusBar();

    return () => {
      backListener.then(handler => handler.remove());
    };
  }, [router, pathname]);

  return null;
}