export function renderError(statusErr) {
    const notFoundDiv = document.createElement('div');
    const notFoundContainer = document.createElement('div');
    const notFound404 = document.createElement('div');
    const h1 = document.createElement('h1');
    const h2 = document.createElement('h2');
    const a = document.createElement('a');
    const span = document.createElement('span');

    notFoundDiv.id = 'notfound';

    notFoundContainer.className = 'notfound';

    notFound404.className = 'notfound-404';

    h1.textContent = statusErr;
    if (statusErr > 300) {
        h2.textContent = 'Страница не найдена'
    }

    a.href = '/';
    span.className = 'arrow';
    a.appendChild(span);
    a.appendChild(document.createTextNode('Вернуться на главную'));

    notFound404.appendChild(h1);
    notFoundContainer.appendChild(notFound404);
    notFoundContainer.appendChild(h2);
    notFoundContainer.appendChild(a);
    notFoundDiv.appendChild(notFoundContainer);

    return notFoundDiv
}
