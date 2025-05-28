document.addEventListener('DOMContentLoaded', function () {
    // Получаем элементы формы
    const animalTypeSelect = document.getElementById('animal-type');
    const animalSizeSelect = document.getElementById('animal-size');
    const timePeriodSelect = document.getElementById('time-period');
    const calculateBtn = document.getElementById('calculate-btn');

    // Получаем элементы для вывода результатов
    const foodCostElement = document.getElementById('food-cost');
    const vetCostElement = document.getElementById('vet-cost');
    const accessoriesCostElement = document.getElementById('accessories-cost');
    const otherCostElement = document.getElementById('other-cost');
    const totalCostElement = document.getElementById('total-cost');

    // Включаем/выключаем выбор размера в зависимости от типа животного
    animalTypeSelect.addEventListener('change', function () {
        animalSizeSelect.disabled = this.value !== 'dog';
    });

    // Базовая стоимость для каждого типа животных (в месяц)
    const baseCosts = {
        cat: {
            food: 2000,
            vet: 1000,
            accessories: 500,
            other: 300
        },
        dog: {
            small: {
                food: 2500,
                vet: 1500,
                accessories: 700,
                other: 500
            },
            medium: {
                food: 4000,
                vet: 2000,
                accessories: 1000,
                other: 700
            },
            large: {
                food: 6000,
                vet: 2500,
                accessories: 1200,
                other: 900
            }
        },
        bird: {
            food: 800,
            vet: 1200,
            accessories: 400,
            other: 200
        },
        fish: {
            food: 300,
            vet: 500,
            accessories: 600,
            other: 400
        },
        reptile: {
            food: 1500,
            vet: 2000,
            accessories: 1000,
            other: 800
        },
        small: {
            food: 500,
            vet: 800,
            accessories: 300,
            other: 200
        },
        horse: {
            food: 15000,
            vet: 8000,
            accessories: 5000,
            other: 3000
        },
        exotic: {
            food: 3000,
            vet: 5000,
            accessories: 2000,
            other: 1500
        }
    };

    // Множители для разных периодов
    const periodMultipliers = {
        month: 1,
        year: 12,
        '5years': 60,
        lifetime: {
            cat: 180, // 15 лет
            dog: 144, // 12 лет (среднее для всех размеров)
            bird: 120, // 10 лет
            fish: 60, // 5 лет
            reptile: 240, // 20 лет
            small: 36, // 3 года
            horse: 300, // 25 лет
            exotic: 180 // 15 лет
        }
    };
    function calculateExpenses() {
        const animalType = animalTypeSelect.value;
        const animalSize = animalSizeSelect.value;
        const timePeriod = timePeriodSelect.value;

        let costs;
        if (animalType === 'dog') {
            costs = baseCosts.dog[animalSize];
        } else {
            costs = baseCosts[animalType];
        }
        let multiplier;
        if (timePeriod === 'lifetime') {
            multiplier = periodMultipliers.lifetime[animalType];
        } else {
            multiplier = periodMultipliers[timePeriod];
        }
        const foodCost = costs.food * multiplier;
        const vetCost = costs.vet * multiplier;
        const accessoriesCost = costs.accessories * multiplier;
        const otherCost = costs.other * multiplier;
        const totalCost = foodCost + vetCost + accessoriesCost + otherCost;

        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        foodCostElement.textContent = formatNumber(foodCost) + ' ₽';
        vetCostElement.textContent = formatNumber(vetCost) + ' ₽';
        accessoriesCostElement.textContent = formatNumber(accessoriesCost) + ' ₽';
        otherCostElement.textContent = formatNumber(otherCost) + ' ₽';
        totalCostElement.textContent = formatNumber(totalCost) + ' ₽';
    }
    calculateBtn.addEventListener('click', calculateExpenses);
    calculateExpenses();
});