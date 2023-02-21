/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 13,
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
    ],
    ignorePatterns: [
        "**/node_modules",
        "**/ignore",
        "**/build",
        "config/*",
    ],
    rules: {
        "semi": ["warn", "never"],
        "indent": ["warn", 4, { "SwitchCase": 1 }],
        "quotes": ["warn", "double", { "avoidEscape": true, "allowTemplateLiterals": true }],
        "comma-dangle": ["warn", "always-multiline"],
        "object-curly-spacing": ["warn", "always"],
        "keyword-spacing": ["warn", { "after": true }],
        "space-before-blocks": ["warn"],
        "prefer-const": ["warn", { "destructuring": "all" }],
        "no-console": "off",
        "no-empty-function": ["off"],
        // ---------------------------------------------------------------------
        // React
        // https://github.com/yannickcr/eslint-plugin-react
        // ---------------------------------------------------------------------
        "react/react-in-jsx-scope": "off", // we've taken care of this with webpack
        "react/prop-types": "off",
        // ---------------------------------------------------------------------
        // TypeScript
        // https://github.com/typescript-eslint/typescript-eslint
        // ---------------------------------------------------------------------
        "@typescript-eslint/no-empty-interface": ["off"],
        // "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "no-unused-vars": "off", // This doesn't play nice with TypeScript
        "@typescript-eslint/no-unused-vars": ["warn", { "ignoreRestSiblings": true, "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
        "@typescript-eslint/no-explicit-any": ["off"],
        "@typescript-eslint/type-annotation-spacing": ["warn"],
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/no-empty-function": ["off"],
        "@typescript-eslint/no-inferrable-types": ["off"],
        "@typescript-eslint/ban-types": ["off"],
        // Have to disable for default generic component prop params.
        // I don't know if that's worded well.
        // Trust me.
        "@typescript-eslint/no-unnecessary-type-constraint": ["off"],
    },
}
