/** @type {import("prettier").Config} */
export default {
  // 1. Core Formatting
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,

  // 2. Import Sorting (Group by: Next/React -> UI Libs -> Internal -> Styles)
  importOrder: [
    '^(react|next|next/.*)$', // Framework first
    '<THIRD_PARTY_MODULES>', // Libraries (Zod, Hook Form, etc.)
    '^@/components/ui/(.*)$', // Shadcn/Base UI
    '^@/features/(.*)$',        // Feature-based folders
    '^@/lib/(.*)$',             // Utilities
    '^[./]',                    // Relative imports
    '^(.*).css$',               // CSS imports last
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // 3. Plugins (Order matters: Tailwind must be last)
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
};