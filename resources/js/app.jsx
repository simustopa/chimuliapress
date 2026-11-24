
import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = 'CHIMULIA PRESS';

createInertiaApp({
    title: (title) => title
        ? `${title} | ${appName}`
        : 'Center for Cultural Impact in Mathematics Learning',

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});
