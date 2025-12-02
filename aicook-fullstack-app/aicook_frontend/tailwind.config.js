/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        borderGray: "#DDDDDD",
        bodyText: "#444444",
        helperText: "#999999",
        warm: {
          lightBlue: "#84cafe",       // Açık Mavi
          vividBlue: "#4294ff",       // Canlı Mavi
          pastelBlue: "#b8e3fe",      // Pastel Mavi
          darkNavy: "#1a3752",        // Koyu Lacivert
          blackishNavy: "#232328",    // Siyahımsı Lacivert
          veryLightBlue: "#e6ecff",   // Çok Açık Mavi
          brightBlue: "#376cfb",   
        },
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        heading: ["24px", { lineHeight: "1.5", letterSpacing: "0.5px" }],
        subheading: ["18px", { lineHeight: "1.5" }],
        body: ["16px", { lineHeight: "1.6" }],
        helper: ["14px", { lineHeight: "1.5" }],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        bold: "700",
      },
    },
  },
  plugins: [],
};
