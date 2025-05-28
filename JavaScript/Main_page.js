document.addEventListener('DOMContentLoaded', function () {
    // Бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const menu = document.querySelector('.menu');

    burgerMenu.addEventListener('click', function () {
        this.classList.toggle('active');
        menu.classList.toggle('active');

        // Блокировка прокрутки при открытом меню
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Закрытие меню при клике на ссылку
    const menuLinks = document.querySelectorAll('.menu-btn');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            burgerMenu.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Загрузка данных из JSON
    fetch('../JSON/cats.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('breeds-container');
            container.innerHTML = ''; // Очищаем сообщение о загрузке

            data.forEach(breed => {
                const card = document.createElement('div');
                card.className = 'breed-card';

                card.innerHTML = `
                            <img src="${breed.image}" alt="${breed.name}" class="breed-image">
                            <div class="breed-info">
                                <h2 class="breed-name">${breed.name}</h2>
                                <p class="breed-description">${breed.description}</p>
                                <div class="breed-features">
                                    <ul class="feature-list">
                                        ${breed.features.map(feature => `<li>${feature}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="breed-lifespan">Продолжительность жизни: ${breed.lifespan}</div>
                            </div>
                        `;

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            document.getElementById('breeds-container').innerHTML =
                '<p class="error">Не удалось загрузить информацию о породах. Пожалуйста, попробуйте позже.</p>';
        });


});

