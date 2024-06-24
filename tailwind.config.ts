import { designSystemPreset } from '@powerhousedao/design-system';
import type { Config } from 'tailwindcss';

const config: Config = {
    important: '#document-editor-context',
    content: [
        './editors/**/*.{html,js,ts,tsx}',
        '.storybook/**/*.{html,js,ts,tsx}',
    ],
    presets: [designSystemPreset],
    theme: {
        extend: {
            height: {
                'app-height': 'var(--app-height)',
            },
            maxWidth: {
                'search-bar-width': 'var(--search-bar-width)',
            },
            boxShadow: {
                button: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
            },
            keyframes: {
                wiggle: {
                  '0%, 100%': {  },
                  '20%': { transform: 'rotate(3deg)', },
                  '40%': { transform: 'rotate(-3deg)', },
                  '60%': { transform: 'rotate(3deg)', },
                  '80%': { transform: 'rotate(-3deg)', },
                },
            },
            animation: {
                'shake': 'wiggle 300ms ease-in-out',
            }
        },
    },
}

export default config;
