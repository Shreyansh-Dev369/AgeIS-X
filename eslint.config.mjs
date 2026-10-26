import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      "react/no-unescaped-entities": "warn",
      "import/no-anonymous-default-export": "off",
      "@next/next/no-img-element": "warn",
      "jsx-a11y/role-supports-aria-props": "warn"
    },
    ignores: [
      ".next/**",
      "node_modules/**",
      "backend/**",
      "public/**",
      "**/*.d.ts",
      "scratch/**"
    ]
  }
];

export default config;
