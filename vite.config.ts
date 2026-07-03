import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        // The router plugin must come before the React plugin.
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react(),
        VitePWA({
            strategies: 'generateSW',
            registerType: 'autoUpdate',
            // Keep the hand-authored public/site.webmanifest instead of generating one.
            manifest: false,
            workbox: {
                globPatterns: [
                    '**/*.{js,css,html,ico,png,svg,jpg,webmanifest}',
                ],
                // The app is fully client-side, so serve the precached shell for
                // any offline navigation (replaces next-pwa's _offline fallback).
                navigateFallback: '/index.html',
                navigateFallbackDenylist: [/^\/assets\//, /\.webmanifest$/],
                cleanupOutdatedCaches: true,
            },
        }),
    ],
});
