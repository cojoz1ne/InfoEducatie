'use client';

import { useEffect } from 'react';

export default function SecureContextPolyfill() {
  if (typeof window !== 'undefined') {
    // Check if we are in an insecure context (HTTP on IP address)
    if (!window.isSecureContext || !window.crypto || !window.crypto.subtle) {
      console.warn('EduWave Polyfill: Detecting insecure context on mobile IP. Applying Web Crypto polyfill...');
      
      // Initialize crypto if missing
      if (!window.crypto) {
        try {
          Object.defineProperty(window, 'crypto', {
            value: {},
            writable: true,
            configurable: true
          });
        } catch (e) {
          (window as any).crypto = {};
        }
      }

      // Initialize subtle if missing
      if (!window.crypto.subtle) {
        try {
          Object.defineProperty(window.crypto, 'subtle', {
            value: {
              digest: async (algorithm: string, data: BufferSource) => {
                console.warn('Polyfilled crypto.subtle.digest called');
                return new ArrayBuffer(0);
              },
              importKey: async () => ({}),
              exportKey: async () => ({}),
              sign: async () => new ArrayBuffer(0),
              verify: async () => true,
              encrypt: async () => new ArrayBuffer(0),
              decrypt: async () => new ArrayBuffer(0),
              generateKey: async () => ({}),
              deriveKey: async () => ({}),
              deriveBits: async () => new ArrayBuffer(0),
              wrapKey: async () => new ArrayBuffer(0),
              unwrapKey: async () => ({})
            },
            writable: true,
            configurable: true
          });
        } catch (e) {
          (window.crypto as any).subtle = {};
        }
      }
    }
  }

  return null;
}
