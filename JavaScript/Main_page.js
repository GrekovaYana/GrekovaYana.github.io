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
function showForm(formId) {
    document.getElementById("registration").style.display = "none";
    document.getElementById("enter").style.display = "none";

    document.getElementById(formId).style.display = "block";
}
document.addEventListener('DOMContentLoaded', function () {

    const testContainer = document.getElementById('test-container');
    const questions = document.querySelectorAll('.question');
    const checkMatchingBtn = document.getElementById('check-matching-btn');
    const mainTestForm = document.getElementById('main-test-form');
    const restartTestBtn = document.getElementById('restart-test');
    const tryAgainBtn = document.getElementById('try-again');
    const resultContent = document.getElementById('result-content');


    let currentQuestion = 0;
    let testScore = {
        cat: 0,
        dog: 0,
        horse: 0,
        fish: 0,
        snake: 0,
        none: 0
    };


    showQuestion(0);


    setupDragAndDrop();


    checkMatchingBtn.addEventListener('click', checkAnimalMatching);

    mainTestForm.addEventListener('submit', function (e) {
        e.preventDefault();
        calculateResults();
        showQuestion(2);
    });


    restartTestBtn.addEventListener('click', resetTest);
    tryAgainBtn.addEventListener('click', resetTest);


    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.classList.toggle('active', i === index);
        });
        currentQuestion = index;
    }


    function setupDragAndDrop() {
        const animalImages = document.querySelectorAll('.animal-image');
        const animalLabels = document.querySelectorAll('.animal-label');


        animalLabels.forEach(label => {
            label.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', this.dataset.animal);
                this.classList.add('dragging');
            });

            label.addEventListener('dragend', function () {
                this.classList.remove('dragging');
            });
        });


        animalImages.forEach(image => {
            image.addEventListener('dragover', function (e) {
                e.preventDefault();
                this.classList.add('highlight');
            });

            image.addEventListener('dragleave', function () {
                this.classList.remove('highlight');
            });

            image.addEventListener('drop', function (e) {
                e.preventDefault();
                this.classList.remove('highlight');

                const animalType = e.dataTransfer.getData('text/plain');
                const correctAnimal = this.dataset.animal;


                const existingLabel = this.querySelector('.animal-label');
                if (existingLabel) {

                    document.querySelector('.animal-labels').appendChild(existingLabel);
                    existingLabel.classList.remove('placed');
                }

                const draggedLabel = document.querySelector(`.animal-label[data-animal="${animalType}"]`);

                if (draggedLabel) {

                    this.innerHTML = '';
                    this.appendChild(draggedLabel);
                    draggedLabel.classList.add('placed');
                    draggedLabel.style.cursor = 'default';
                    this.dataset.userAnswer = animalType;
                }
            });
        });
    }

    function checkAnimalMatching() {
        const animalImages = document.querySelectorAll('.animal-image');
        let allCorrect = true;

        animalImages.forEach(image => {
            const correctAnimal = image.dataset.animal;
            const userAnswer = image.dataset.userAnswer;

            if (userAnswer === correctAnimal) {
                image.classList.add('correct');
            } else {
                image.classList.add('incorrect');
                allCorrect = false;
            }
        });
        if (allCorrect) {
            setTimeout(() => {
                showQuestion(1);
            }, 2000);
        } else {
            setTimeout(() => {
                showQuestion(3);
            }, 2000);
        }
    }


    function calculateResults() {
        const formData = new FormData(mainTestForm);
        const answers = Object.fromEntries(formData.entries());

        testScore = {
            cat: 0,
            dog: 0,
            horse: 0,
            fish: 0,
            snake: 0,
            none: 0
        };

        //1
        switch (answers.time) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 2; testScore.snake += 1; break;
            case '3': testScore.dog += 2; testScore.horse += 1; break;
            case '4': testScore.dog += 3; testScore.horse += 2; break;
        }

        //2
        switch (answers.size) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 3; testScore.dog += 1; break;
            case '3': testScore.dog += 3; testScore.horse += 1; break;
            case '4': testScore.horse += 3; testScore.dog += 1; break;
        }

        //3
        switch (answers.budget) {
            case '1': testScore.fish += 3; testScore.none += 2; break;
            case '2': testScore.cat += 2; testScore.snake += 1; break;
            case '3': testScore.dog += 2; testScore.horse += 1; break;
            case '4': testScore.horse += 3; testScore.dog += 2; break;
        }

        //4
        switch (answers.communication) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 2; testScore.snake += 1; break;
            case '3': testScore.dog += 2; testScore.cat += 1; break;
            case '4': testScore.dog += 3; testScore.horse += 2; break;
        }

        //5
        switch (answers.travel) {
            case '1': testScore.none += 3; testScore.fish += 1; break;
            case '2': testScore.cat += 2; testScore.fish += 1; break;
            case '3': testScore.dog += 1; testScore.horse += 1; break;
            case '4': testScore.dog += 2; testScore.horse += 2; break;
        }

        //6
        switch (answers.allergy) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.snake += 3; testScore.fish += 2; break;
            case '3': testScore.fish += 2; testScore.snake += 1; break;
            case '4': // Нет штрафов
        }

        //7
        switch (answers.experience) {
            case '1': testScore.fish += 2; testScore.none += 1; break;
            case '2': testScore.cat += 2; break;
            case '3': testScore.dog += 2; break;
            case '4': testScore.horse += 3; testScore.snake += 2; break;
        }

        //8
        switch (answers.housing) {
            case '1': testScore.fish += 3; testScore.none += 2; break;
            case '2': testScore.cat += 2; testScore.fish += 1; break;
            case '3': testScore.dog += 2; testScore.cat += 1; break;
            case '4': testScore.dog += 3; testScore.horse += 3; break;
        }

        //9
        switch (answers.activity) {
            case '1': testScore.fish += 3; testScore.cat += 1; break;
            case '2': testScore.cat += 2; testScore.snake += 1; break;
            case '3': testScore.dog += 2; testScore.horse += 1; break;
            case '4': testScore.dog += 3; testScore.horse += 3; break;
        }

        //10
        switch (answers.noise) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 2; testScore.fish += 1; break;
            case '3': testScore.dog += 1; testScore.horse += 1; break;
            case '4': testScore.dog += 3; break;
        }

        //11
        switch (answers.duration) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 2; testScore.dog += 1; break;
            case '3': testScore.dog += 3; testScore.horse += 1; break;
            case '4': testScore.horse += 3; testScore.dog += 2; break;
        }

        //12
        switch (answers.reason) {
            case '1': testScore.fish += 3; testScore.snake += 2; break;
            case '2': testScore.cat += 3; testScore.dog += 1; break;
            case '3': testScore.dog += 3; testScore.cat += 2; break;
            case '4': testScore.dog += 3; testScore.horse += 3; break;
        }


        const maxScore = Math.max(...Object.values(testScore));
        const results = {};

        for (const [animal, score] of Object.entries(testScore)) {
            results[animal] = Math.round((score / maxScore) * 100);
        }


        displayResults(results);
    }


    function displayResults(results) {

        if (results.none < Math.max(results.cat, results.dog, results.horse, results.fish, results.snake)) {
            delete results.none;
        }


        const sortedResults = Object.entries(results).sort((a, b) => b[1] - a[1]);

        const bestMatch = sortedResults[0];

        let html = '';

        sortedResults.forEach(([animal, percentage]) => {
            const isBest = animal === bestMatch[0];

            html += `
                <div class="animal-result ${isBest ? 'best-match' : ''}">
                    <h3>${getAnimalName(animal)} ${isBest ? '<span class="best-match-tag">(Лучший выбор)</span>' : ''}</h3>
                    <div class="match-percentage">Совпадение: ${percentage}%</div>
                    <p>${getAnimalDescription(animal)}</p>
                    <p><strong>Почему:</strong> ${getAnimalReason(animal, percentage)}</p>
                </div>
            `;
        });

        resultContent.innerHTML = html;
    }

    function getAnimalName(animal) {
        const names = {
            cat: 'Кошка',
            dog: 'Собака',
            horse: 'Лошадь',
            fish: 'Рыбки',
            snake: 'Экзотические животные (змеи и др.)',
            none: 'Никто'
        };
        return names[animal] || '';
    }

    function getAnimalDescription(animal) {
        const descriptions = {
            cat: 'Независимые, чистоплотные животные, которые хорошо подходят для жизни в квартире. Требуют умеренного внимания и ухода.',
            dog: 'Верные и преданные друзья, требующие регулярного внимания, прогулок и тренировок. Подходят активным людям.',
            horse: 'Крупные, умные животные, требующие много пространства и ухода. Подходят для сельской местности и людей с опытом.',
            fish: 'Спокойные, неприхотливые питомцы, идеальные для начинающих. Требуют минимального ухода, но специфических условий содержания.',
            snake: 'Экзотические питомцы для ценителей необычного. Требуют специальных условий и знаний по содержанию.',
            none: 'Сейчас вам может быть лучше без домашнего животного. Возможно, стоит пересмотреть свои возможности и желания.'
        };
        return descriptions[animal] || '';
    }

    function getAnimalReason(animal, percentage) {
        const reasons = {
            cat: `Ваши ответы показали, что кошка лучше всего соответствует вашему образу жизни. Кошки относительно самостоятельны, не требуют постоянного внимания и хорошо подходят для жизни в квартире. При этом они могут быть ласковыми и общительными, когда вы этого хотите.`,
            dog: `Собака - идеальный выбор для вас! Ваши ответы свидетельствуют, что вы готовы уделять питомцу достаточно времени и внимания. Собаки требуют регулярных прогулок, тренировок и общения, но взамен дарят безграничную любовь и преданность.`,
            horse: `Лошадь - отличный выбор для вас! Ваши ответы показывают, что у вас достаточно пространства, времени и ресурсов для содержания такого крупного животного. Лошади требуют много внимания и ухода, но могут стать прекрасными компаньонами для активных людей.`,
            fish: `Рыбки - оптимальный выбор для вас. Они не требуют много времени и внимания, но создают уютную атмосферу в доме. Ваши ответы показывают, что вам нужно животное, которое не будет отнимать много ресурсов.`,
            snake: `Экзотические животные, такие как змеи, подходят вам больше всего. Ваши ответы показывают, что вы цените необычность и готовы обеспечить специфические условия содержания. Эти животные не требуют много общения, но нуждаются в правильном уходе.`,
            none: `Ваши ответы показывают, что сейчас у вас может не быть достаточного количества времени, ресурсов или желания для полноценного ухода за животным. Возможно, стоит подождать более подходящего момента или рассмотреть вариант временного присмотра за чужими питомцами.`
        };

        return reasons[animal] || '';
    }

    function resetTest() {
        const animalImages = document.querySelectorAll('.animal-image');
        const animalLabels = document.querySelectorAll('.animal-label');

        animalImages.forEach(image => {
            image.innerHTML = '';
            image.classList.remove('correct', 'incorrect', 'highlight');
            delete image.dataset.userAnswer;
        });

        animalLabels.forEach(label => {
            label.classList.remove('placed', 'dragging');
            document.querySelector('.animal-labels').appendChild(label);
        });
        mainTestForm.reset();
        showQuestion(0);
    }
});
function initYandexMap() {
    var map = new ymaps.Map("yandex-map-irkt", {
      center: [52.27515415312987, 104.27977082209006],
      zoom: 17,
      controls: ['zoomControl']
    });
    
    var placemark = new ymaps.Placemark([52.27515415312987, 104.27977082209006], {
      hintContent: 'ул. Гагарина, 20',
      balloonContent: '<div style="padding: 5px;"><strong>ул. Гагарина, 20</strong><br>Иркутск, Россия</div>'
    }, {
      preset: 'islands#redDotIcon',
      iconColor: '#ff0000'
    });
    
    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    
    map.geoObjects.add(placemark);
    placemark.balloon.open();
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      map.behaviors.disable('drag');
    }
  }