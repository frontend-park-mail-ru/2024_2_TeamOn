
export const state = {
    activePageLink: null,
    menuElements: {},
    currentUser: null
};

export const maxAttempts = 3;

export const users = {
    'alex': {
        email: 'alex@mail.com',
        password: 'alesha',
        imagesrc: 'https://steamuserimages-a.akamaihd.net/ugc/2041856159322303572/F430E99639B6B932EA68CF4DF6B233ED78AD547B/?imw=512&amp;imh=302&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true',
    },
    'olya': {
        email: 'olya@mail.ru',
        password: '12345',
        imagesrc: 'https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg',
    },
    'danil': {
        email: 'danil@mail.ru',
        password: 'javascript',
        imagesrc: 'https://obruchalki.com/upload/iblock/4f6/4f6d56a0ad82e61874b989aac7146b1e.jpg',
    },
    'polina': {
        email: 'polina@mail.ru',
        password: 'polina_',
        imagesrc: 'https://distribution.faceit-cdn.net/images/06774d23-b456-4ea4-825e-d261d627db5d.jpeg',
    }
};

const HOME_HREF = '/';
const HOME_TEXT = 'Домашняя страница';
const LOGIN_HREF = '/login';
const LOGIN_TEXT = 'Авторизация';
const SIGNUP_HREF = '/signup';
const SIGNUP_TEXT = 'Домашняя страница';
const PROFILE_HREF = '/profile';
const PROFILE_TEXT = 'Домашняя страница';
const FEED_HREF = '/feed';
const FEED_TEXT = 'Домашняя страница';
