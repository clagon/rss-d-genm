import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./en.json'));
register('ja', () => import('./ja.json'));

init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator()
});
