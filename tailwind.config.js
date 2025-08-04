/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite/**/*.js",
  ],
  theme: {
  	screens: {
  		sm: '640px',
  		md: '768px',
  		lg: '1150px',
  		xl: '1280px',
  		'2xl': '1536px'
  	},
  	colors: {
  		transparent: 'transparent',
  		current: 'currentColor',
  		lightwhite: '#F9F9F9',
  		white: '#ffffff',
  		black: '#000000',
  		blue: '#0066FF',
  		lightblue: '#d9e8ff',
  		darkpurple: '#241A24',
  		lightgrey: '#F4F5F6',
  		navyblue: '#00224A',
  		darkblue: '#1E013A',
  		offwhite: 'rgba(255, 255, 255, 0.75)',
  		lightblack: 'rgba(0, 0, 0, 0.55)',
  		bluish: 'rgba(14, 13, 13, 0.75)',
  		testColor: 'rgba(54, 54, 54, 0.75)',
  		grey: '#909090',
  		bgblue: '#02398A',
  		darkgrey: '#747474',
  		faqblue: '#0861FF',
  		gold: '#FAAF38',
  		hoblue: '#0000FF',
  		btnblue: '#267dff',
  		bggrey: '#DDDDDD',
  		footer: 'rgba(226, 223, 223, 0.75)',
  		linegrey: '#C4C4C4',
  		primary: {
  			'50': '#eff6ff',
  			'100': '#dbeafe',
  			'200': '#bfdbfe',
  			'300': '#93c5fd',
  			'400': '#60a5fa',
  			'500': '#3b82f6',
  			'600': '#2563eb',
  			'700': '#1d4ed8',
  			'800': '#1e40af',
  			'900': '#1e3a8a'
  		}
  	},
  	fontSize: {
  		xs: [
  			'0.75rem',
  			{
  				lineHeight: '1rem'
  			}
  		],
  		sm: [
  			'0.875rem',
  			{
  				lineHeight: '1.25rem'
  			}
  		],
  		base: [
  			'1rem',
  			{
  				lineHeight: '1.5rem'
  			}
  		],
  		lg: [
  			'1.125rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		xl: [
  			'1.25rem',
  			{
  				lineHeight: '1.75rem'
  			}
  		],
  		'2xl': [
  			'1.5rem',
  			{
  				lineHeight: '2rem'
  			}
  		],
  		'3xl': [
  			'1.875rem',
  			{
  				lineHeight: '2.25rem'
  			}
  		],
  		'4xl': [
  			'2.25rem',
  			{
  				lineHeight: '2.5rem'
  			}
  		],
  		'5xl': [
  			'3rem',
  			{
  				lineHeight: '1'
  			}
  		],
  		'6xl': [
  			'3.75rem',
  			{
  				lineHeight: '1'
  			}
  		],
  		'7xl': [
  			'4.5rem',
  			{
  				lineHeight: '1'
  			}
  		],
  		'8xl': [
  			'6rem',
  			{
  				lineHeight: '1'
  			}
  		],
  		'9xl': [
  			'8rem',
  			{
  				lineHeight: '1'
  			}
  		],
  		'65xl': [
  			'65px',
  			{
  				lineHeight: '1'
  			}
  		],
  		'80xl': [
  			'80px',
  			{
  				lineHeight: '6rem'
  			}
  		]
  	},
  	extend: {
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("flowbite-typography"), require("flowbite/plugin")],
};
