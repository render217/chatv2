/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        clrSmokyBlack: "#120F13",
        clrPearlBush: "#E0E0E0",
        clrGunsmoke: "#828282",
        clrBalticSea: "#252329",
        clrShipGrey: "#3C393F",
        clrValentineRed: "#EB5757",
        clrClearBlue: "#2F80ED",
        clrNight: "#0B090C",
        clrPorcelain: "#F2F2F2",
        clrFrenchGray: "#BDBDBD",
      },
      fontFamily: {
        NotoSans: ["Noto Sans", "sans-serif"],
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};
