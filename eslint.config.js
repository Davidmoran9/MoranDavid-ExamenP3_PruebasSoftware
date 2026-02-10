module.exports = [
    {
        ignores: ['coverage/**', 'node_modules/**', 'dist/**', 'build/**']
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
        },
    },
];
