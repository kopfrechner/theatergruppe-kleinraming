import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // Customize your rules here
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: ['dist', 'node_modules', '.astro'],
  },
);
