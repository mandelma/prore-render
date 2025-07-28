import { createI18n } from 'vue-i18n';
import fin from './lang/fin.json';
import en from './lang/en.json';
import est from './lang/est.json';

const i18n = createI18n({
    legacy: false,
    //globalInjection: true,
    locale: localStorage.getItem('lang') || 'fin',
    fallbackLocale: 'fin',
    messages: {
        en,
        fin,
        est
    }
});

export default i18n;