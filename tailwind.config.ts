import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
      },
      keyframes: {
        slideUp: {
          '0%': { 
            transform: 'translateY(100px)',
          },
          '100%': { 
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          '0%': { 
            opacity: '0'
          },
          '100%': { 
            opacity: '1'
          },
        }
      },
      animation: {
        slideInFromBottom: 'slideUp 0.3s ease-out 0.2s both, fadeIn 0.3s ease-out 0.3s both'
      },
    },
  },
  plugins: [],
} satisfies Config;
