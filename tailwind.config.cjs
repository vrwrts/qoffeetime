module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    plugins: [
        require('tailwindcss-only-child'),
        require('@tailwindcss/typography'),
    ],
    theme: {
        extend: {
            colors: {
                brand: '#ff1744',
                coffee: '#8a0020',
                current: 'currentColor',
            },
            typography: {
                DEFAULT: {
                    css: {
                        color: 'currentColor',
                        lineHeight: '1.5',
                        a: {
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'none',
                            },
                        },
                        'h1,h2,h3,h4,h5,i,strong': {
                            color: 'currentColor',
                        },
                    },
                },
            },
        },
    },
};
