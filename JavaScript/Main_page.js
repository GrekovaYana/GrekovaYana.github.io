function showForm(formId) {
    document.getElementById("registration").style.display = "none";
    document.getElementById("enter").style.display = "none";
    document.getElementById(formId).style.display = "block";
}

document.addEventListener('DOMContentLoaded', function () {
    // Бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const menu = document.querySelector('.menu');

    if (burgerMenu && menu) {
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
    }

    const pageName = document.body.getAttribute('data-page');
    const pageConfig = {
        'cats': { json: 'cats.json', key: 'cats' },
        'dogs': { json: 'dogs.json', key: 'dogs' },
        'horses': { json: 'horses.json', key: 'horses' },
        'fishes': { json: 'fishes.json', key: 'fishes' },
        'exotic_animals': { json: 'exotic_animals.json', key: 'exotic_animals' }
    };

    const config = pageConfig[pageName] || pageConfig['cats'];
    const isDarkTheme = document.body.classList.contains('dark-theme');
    updateTheme(isDarkTheme);

    fetch(`../JSON/${config.json}`)
        .then(response => response.json())
        .then(data => {
            const breeds = data[config.key];
            const container = document.getElementById('breeds-container');
            if (!container) return;

            container.innerHTML = breeds.map(breed => `
                <div class="breed-card">
                    <img src="${breed.image}" alt="${breed.name}" class="breed-image">
                    <div class="breed-info">
                        <h2>${breed.name}</h2>
                        <p class="breed-description">${breed.description}</p>
                        ${breed.features ? `<ul>${breed.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
                        ${breed.lifespan ? `<div class="breed-lifespan">Продолжительность жизни: ${breed.lifespan}</div>` : ''}
                    </div>
                </div>
            `).join('');
            updateTheme(isDarkTheme);
        })
        .catch(error => {
            console.error('Error:', error);
            const container = document.getElementById('breeds-container');
            if (container) container.innerHTML = `<p class="error">Ошибка: ${error.message}</p>`;
        });

    const savedTheme = localStorage.getItem('theme');
    const DarkTheme = savedTheme === 'dark';

    if (DarkTheme) {
        document.body.classList.add('dark-theme');
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = DarkTheme;

        themeToggle.addEventListener('change', () => {
            const isDarkNow = themeToggle.checked;
            document.body.classList.toggle('dark-theme', isDarkNow);
            updateTheme(isDarkNow);
            localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
        });
    }
    function showForm(formId) {
        document.getElementById("registration").style.display = "none";
        document.getElementById("enter").style.display = "none";
        document.getElementById(formId).style.display = "block";
    }

    const testContainer = document.getElementById('test-container');
    if (testContainer) {
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

        if (checkMatchingBtn) checkMatchingBtn.addEventListener('click', checkAnimalMatching);
        if (mainTestForm) mainTestForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateResults();
            showQuestion(2);
        });
        if (restartTestBtn) restartTestBtn.addEventListener('click', resetTest);
        if (tryAgainBtn) tryAgainBtn.addEventListener('click', resetTest);

        function showQuestion(index) {
            questions.forEach((question, i) => {
                question.classList.toggle('active', i === index);
            });
            currentQuestion = index;
        }

        function resetTest() {
            const animalImages = document.querySelectorAll('.animal-image');
            const animalLabels = document.querySelectorAll('.animal-label');
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {

                document.querySelectorAll('.mobile-select').forEach(select => select.remove());


                animalImages.forEach(image => {
                    image.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = image.dataset.src || '';
                    img.alt = image.dataset.animal;
                    image.appendChild(img);

                    setupDragAndDrop();
                });
            } else {

                animalImages.forEach(image => {
                    image.innerHTML = '';
                    image.classList.remove('correct', 'incorrect', 'highlight');
                    delete image.dataset.userAnswer;
                });

                animalLabels.forEach(label => {
                    label.classList.remove('placed', 'dragging');
                    document.querySelector('.animal-labels').appendChild(label);
                });
            }

            mainTestForm.reset();
            showQuestion(0);
        }

        function setupDragAndDrop() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

            if (isMobile) {
                const animalImages = document.querySelectorAll('.animal-image');


                document.querySelectorAll('.mobile-select').forEach(select => select.remove());

                animalImages.forEach(image => {
                    const animalType = image.dataset.animal;
                    const imgSrc = image.querySelector('img')?.src || '';


                    image.dataset.src = imgSrc;


                    const container = document.createElement('div');
                    container.className = 'mobile-image-container';

                    const select = document.createElement('select');
                    select.className = 'mobile-select';
                    select.dataset.target = animalType;


                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = 'Выберите';
                    select.appendChild(defaultOption);


                    const animals = ['cat', 'dog', 'horse', 'fish', 'snake'];
                    animals.forEach(animal => {
                        const option = document.createElement('option');
                        option.value = animal;
                        option.textContent = getAnimalName(animal);
                        select.appendChild(option);
                    });

                    container.appendChild(select);
                    image.innerHTML = '';
                    image.appendChild(container);


                    select.addEventListener('change', function () {
                        image.dataset.userAnswer = this.value;
                    });
                });


                const labelsContainer = document.querySelector('.animal-labels');
                if (labelsContainer) {
                    labelsContainer.style.display = 'none';
                }
            } else {

                const labelsContainer = document.querySelector('.animal-labels');
                if (labelsContainer) {
                    labelsContainer.style.display = 'flex';
                }


                const animalImages = document.querySelectorAll('.animal-image');
                const animalLabels = document.querySelectorAll('.animal-label');

                animalLabels.forEach(label => {
                    label.setAttribute('draggable', 'true');

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
                        handleDrop(this, animalType);
                    });
                });
            }
        }

        function checkAnimalMatching() {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            let allCorrect = true;

            if (isMobile) {
                const selects = document.querySelectorAll('.mobile-select');
                selects.forEach(select => {
                    const correctAnimal = select.dataset.target;
                    const userAnswer = select.value;

                    if (userAnswer === correctAnimal) {
                        select.classList.add('correct');
                        select.classList.remove('incorrect');
                    } else {
                        select.classList.add('incorrect');
                        select.classList.remove('correct');
                        allCorrect = false;
                    }
                });
            } else {
                const animalImages = document.querySelectorAll('.animal-image');
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
            }

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

        function handleDrop(targetElement, animalType) {
            const correctAnimal = targetElement.dataset.animal;

            const existingLabel = targetElement.querySelector('.animal-label');
            if (existingLabel) {
                document.querySelector('.animal-labels').appendChild(existingLabel);
                existingLabel.classList.remove('placed');
            }

            const draggedLabel = document.querySelector(`.animal-label[data-animal="${animalType}"]`);

            if (draggedLabel) {
                targetElement.innerHTML = '';
                targetElement.appendChild(draggedLabel);
                draggedLabel.classList.add('placed');
                draggedLabel.style.cursor = 'default';
                targetElement.dataset.userAnswer = animalType;
            }
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

            switch (answers.time) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.cat += 2; testScore.snake += 1; break;
                case '3': testScore.dog += 2; testScore.horse += 1; break;
                case '4': testScore.dog += 3; testScore.horse += 2; break;
            }

            switch (answers.size) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.cat += 3; testScore.dog += 1; break;
                case '3': testScore.dog += 3; testScore.horse += 1; break;
                case '4': testScore.horse += 3; testScore.dog += 1; break;
            }


            switch (answers.budget) {
                case '1': testScore.fish += 3; testScore.none += 2; break;
                case '2': testScore.cat += 2; testScore.snake += 1; break;
                case '3': testScore.dog += 2; testScore.horse += 1; break;
                case '4': testScore.horse += 3; testScore.dog += 2; break;
            }


            switch (answers.communication) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.cat += 2; testScore.snake += 1; break;
                case '3': testScore.dog += 2; testScore.cat += 1; break;
                case '4': testScore.dog += 3; testScore.horse += 2; break;
            }

            switch (answers.travel) {
                case '1': testScore.none += 3; testScore.fish += 1; break;
                case '2': testScore.cat += 2; testScore.fish += 1; break;
                case '3': testScore.dog += 1; testScore.horse += 1; break;
                case '4': testScore.dog += 2; testScore.horse += 2; break;
            }


            switch (answers.allergy) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.snake += 3; testScore.fish += 2; break;
                case '3': testScore.fish += 2; testScore.snake += 1; break;
                case '4': break;
            }

            switch (answers.experience) {
                case '1': testScore.fish += 2; testScore.none += 1; break;
                case '2': testScore.cat += 2; break;
                case '3': testScore.dog += 2; break;
                case '4': testScore.horse += 3; testScore.snake += 2; break;
            }

            switch (answers.housing) {
                case '1': testScore.fish += 3; testScore.none += 2; break;
                case '2': testScore.cat += 2; testScore.fish += 1; break;
                case '3': testScore.dog += 2; testScore.cat += 1; break;
                case '4': testScore.dog += 3; testScore.horse += 3; break;
            }

            switch (answers.activity) {
                case '1': testScore.fish += 3; testScore.cat += 1; break;
                case '2': testScore.cat += 2; testScore.snake += 1; break;
                case '3': testScore.dog += 2; testScore.horse += 1; break;
                case '4': testScore.dog += 3; testScore.horse += 3; break;
            }

            switch (answers.noise) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.cat += 2; testScore.fish += 1; break;
                case '3': testScore.dog += 1; testScore.horse += 1; break;
                case '4': testScore.dog += 3; break;
            }

            switch (answers.duration) {
                case '1': testScore.fish += 3; testScore.snake += 2; break;
                case '2': testScore.cat += 2; testScore.dog += 1; break;
                case '3': testScore.dog += 3; testScore.horse += 1; break;
                case '4': testScore.horse += 3; testScore.dog += 2; break;
            }

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
    }
});

function updateTheme(isDark) {
    document.querySelectorAll('.breed-card').forEach(card => {
        card.classList.toggle('dark-theme-card', isDark);
    });
    document.querySelectorAll('.breed-info, .error').forEach(el => {
        el.classList.toggle('dark-theme-text', isDark);
    });
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
    const baseReasons = {
        cat: {
            low: 'Кошки не очень подходят вам по вашему образу жизни и предпочтениям. Они требуют больше внимания или других условий содержания, чем вы можете предоставить.',
            medium: 'Кошка может быть хорошим выбором для вас, но не идеальным. Вам нужно быть готовым к некоторым компромиссам в уходе и содержании.',
            high: 'Кошка - идеальный питомец для вас! Ваши предпочтения и образ жизни прекрасно совпадают с потребностями кошек.'
        },
        dog: {
            low: 'Собака не лучший выбор для вас в данный момент. Они требуют больше времени, внимания и активности, чем вы готовы уделять.',
            medium: 'Собака может быть хорошим компаньоном, но вам нужно будет адаптировать свой график и условия для полноценного ухода за ней.',
            high: 'Собака - ваш идеальный питомец! Ваша активность и готовность уделять время питомцу прекрасно сочетаются с потребностями собаки.'
        },
        horse: {
            low: 'Лошадь не подходит вам по условиям содержания и возможностям ухода. Они требуют много пространства, времени и специальных знаний.',
            medium: 'Лошадь может быть интересным вариантом, но вам потребуются дополнительные ресурсы и знания для правильного содержания.',
            high: 'Лошадь - ваш идеальный выбор! У вас есть все необходимое для содержания такого требовательного животного.'
        },
        fish: {
            low: 'Рыбки не самый подходящий для вас вариант, возможно, из-за необходимости специфического ухода или вашего желания более интерактивного питомца.',
            medium: 'Рыбки могут быть хорошим выбором, но вам нужно изучить особенности их содержания и быть готовым к регулярному уходу за аквариумом.',
            high: 'Рыбки - идеальный выбор для вас! Их неприхотливость и ваши предпочтения прекрасно совпадают.'
        },
        snake: {
            low: 'Экзотические животные не рекомендуются вам. Они требуют специальных условий и знаний, которые не соответствуют вашим текущим возможностям.',
            medium: 'Экзотические животные могут быть интересны вам, но потребуют серьезной подготовки и изучения особенностей содержания.',
            high: 'Экзотические животные идеально вам подходят! Ваша готовность к нестандартным решениям и уходу делает вас отличным владельцем такого питомца.'
        },
        none: {
            low: 'Сейчас вам действительно лучше не заводить питомца. Ваши текущие возможности и образ жизни не позволяют обеспечить животному должный уход.',
            medium: 'Возможно, вам стоит повременить с приобретением питомца или рассмотреть варианты временного содержания животных.',
            high: 'Сейчас не лучшее время для заведения питомца. Рекомендуем пересмотреть этот вопрос, когда ваши обстоятельства изменятся.'
        }
    };

    let level;
    if (percentage <= 35) {
        level = 'low';
    } else if (percentage <= 75) {
        level = 'medium';
    } else {
        level = 'high';
    }

    return baseReasons[animal]?.[level] || 'Нет информации о данном животном.';
}

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