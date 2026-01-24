import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.suprmushrooms.app',
  appName: 'Supr Mushrooms',
  webDir: 'public', 
  server: {
    url: 'https://supr-mushroom.vercel.app/', // ⚠️ MAKE SURE THIS IS YOUR EXACT LIVE URL
    cleartext: true
  }
};

export default config;