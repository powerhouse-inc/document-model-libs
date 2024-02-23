import { getConfig } from '@powerhousedao/codegen';
import type { StorybookConfig } from '@storybook/react-vite';
import { InlineConfig, mergeConfig } from 'vite';

const { editorsDir } = getConfig();

const config: StorybookConfig = {
    stories: [`../${editorsDir}/**/*.stories.@(js|jsx|mjs|ts|tsx)`],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        './addons/operations-preset.ts',
    ],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    async viteFinal(config) {
        return mergeConfig(config, {
            resolve: {
                alias: {
                    module: './create-require.js',
                    path: 'path-browserify',
                    crypto: 'crypto-browserify',
                },
            },
        } as InlineConfig);
    },
};
export default config;
