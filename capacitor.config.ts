import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shrishyam.gasagency',
  appName: 'Shri Shyam Gas Agency',
  webDir: 'out',
  server: {
    url: 'https://agency-management-orpin.vercel.app',
    cleartext: true,
  }
};

export default config;
