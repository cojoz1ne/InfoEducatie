import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eduwave.app',
  appName: 'EduWave',
  webDir: 'out',
  server: {
    url: 'http://25.9.32.16:3000',
    cleartext: true
  }
};

export default config;
