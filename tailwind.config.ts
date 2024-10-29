import type { Config } from "tailwindcss";
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			baseWhite: '#F9F9F9',
  			baseBlack: '#0B0B0B',
  			primary: {
  				'100': '#F2EDE6',
  				'200': '#E5DACE',
  				'300': '#D7C8B7',
  				'400': '#CAB69F',
  				'500': '#9F7651',
  				'600': '#8F694A',
  				'700': '#7F5C42',
  				'800': '#6F4F3B',
  				'900': '#5F4234',
  				'1000': '#4F352D',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'100': '#F4F0E8',
  				'200': '#E8E1D1',
  				'300': '#DCD3B9',
  				'400': '#D0C4A2',
  				'500': '#C2B59C',
  				'600': '#AFA287',
  				'700': '#9D9072',
  				'800': '#8A7D5D',
  				'900': '#776A48',
  				'1000': '#645733',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			neutrals: {
  				'100': '#F2F2F2',
  				'200': '#DDDDDD',
  				'300': '#C7C7C7',
  				'400': '#B2B2B2',
  				'500': '#9D9D9D',
  				'600': '#888888',
  				'700': '#737373',
  				'800': '#5E5E5E',
  				'900': '#494949',
  				'1000': '#343434'
  			},
  			success: {
  				'100': '#E3FAF8',
  				'200': '#C7F5F1',
  				'300': '#AAEFEA',
  				'400': '#8EEAE4',
  				'500': '#67D9CE',
  				'600': '#54B4A9',
  				'700': '#418F84',
  				'800': '#2E6A60',
  				'900': '#1B453B',
  				DEFAULT: '#67D9CE'
  			},
  			warning: {
  				'100': '#FDF3E6',
  				'200': '#FBE7CD',
  				'300': '#F9DAB5',
  				'400': '#F7CE9C',
  				'500': '#F9B156',
  				'600': '#F59741',
  				'700': '#F37E2D',
  				'800': '#F06418',
  				'900': '#EE4B04',
  				DEFAULT: '#F9B156'
  			},
  			error: {
  				'100': '#FCEAE9',
  				'200': '#F9D5D3',
  				'300': '#F6C0BD',
  				'400': '#F4ABA7',
  				'500': '#E65A63',
  				'600': '#C54E55',
  				'700': '#A44148',
  				'800': '#83353A',
  				'900': '#62282D',
  				DEFAULT: '#E65A63'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [tailwindcssAnimate, require("tailwindcss-animate")],
};
export default config;
