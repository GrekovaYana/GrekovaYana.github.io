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

document.addEventListener('DOMContentLoaded', function() {
    // Получаем имя файла из URL
    const pageName = document.body.dataset.page || 
                 window.location.pathname.split('/').pop().split('.')[0];
    
   //Нам необходима проверка на животное. В зависимости от того, страница какого животного загружается, такой JSON-файл и должен подключаться
    const pageConfig = {
        'cats': { json: 'cats.json', key: 'cats' },
        'dogs': { json: 'dogs.json', key: 'dogs' },
        'horses': { json: 'horses.json', key: 'horses' },
        'fishes': { json: 'fishes.json', key: 'fishes' },
        'exotic_animals': { json: 'exotic_animals.json', key: 'exotic_animals' }
    };
    

    const config = pageConfig[pageName] || pageConfig['cats'];
    

    fetch(`../JSON/${config.json}`)
        .then(response => {
            if (!response.ok) throw new Error('Ошибка загрузки данных');
            return response.json();
        })
        .then(data => {
            const breeds = data[config.key];
            const container = document.getElementById('breeds-container');
            
            if (!breeds || !Array.isArray(breeds)) {
                throw new Error('Некорректный формат данных');
            }
            
            container.innerHTML = breeds.map(breed => `
                <div class="breed-card">
                    <img src="${breed.image}" alt="${breed.name}" class="breed-image">
                    <div class="breed-info">
                        <h2>${breed.name}</h2>
                        <p>${breed.description}</p>
                        ${breed.features ? `
                        <div class="breed-features">
                            <ul>${breed.features.map(f => `<li>${f}</li>`).join('')}</ul>
                        </div>` : ''}
                        ${breed.lifespan ? `
                        <div class="breed-lifespan">Продолжительность жизни: ${breed.lifespan}</div>` : ''}
                    </div>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Ошибка:', error);
            const container = document.getElementById('breeds-container');
            if (container) {
                container.innerHTML = `
                    <p class="error">Ошибка загрузки данных. Пожалуйста, попробуйте позже.</p>
                    <p>${error.message}</p>
                `;
            }
        });
});
