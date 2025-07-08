// @filename tailwind.config.js
module.exports = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                'heading': ['Sora', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                'body': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        // ...
    ],
}