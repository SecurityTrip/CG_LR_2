let canvas = document.getElementById("drawfrac");
let ctx = canvas.getContext("2d");

// Получаем ссылки на элементы
let selectElem = document.getElementById("fracdepth");
let iteratorDiv = document.getElementById("iterator");
let inputElem = document.getElementById("fracit");
let inputWidth = document.getElementById("fracwidth");
let iterations = Number(selectElem.value); // Инициализируем количеством итераций по умолчанию

// Параметры фрактала
let axiom = "F+F+F";
let rule = "F-F+F";
let angle = (2 * Math.PI) / 3; // Угол поворота (120 градусов)
let length = Number(inputWidth.value); // Длина шага

// Переменные для управления положением фрактала
let offsetX = canvas.width / 2; // Начальная позиция по X
let offsetY = canvas.height / 2; // Начальная позиция по Y
let scale = 1; // Коэффициент масштабирования

// Переменные для отслеживания движения мыши
let isDragging = false;
let startX, startY;

// Функция для управления видимостью и установкой итераций
function toggleIteratorVisibility() {
    if (selectElem.value === "-1") {
        iteratorDiv.style.display = "block"; // Показываем div для ввода числа
    } else {
        iteratorDiv.style.display = "none"; // Скрываем div
        iterations = Number(selectElem.value); // Обновляем количество итераций
        updateAndRedraw(); // Перерисовываем фрактал
    }
}

// Обработчик на изменение значения select
selectElem.addEventListener("change", toggleIteratorVisibility);

// Функция для генерации строки фрактала по правилам
function generateLSystem(axiom, rule, iterations) {
    let result = axiom;
    for (let i = 0; i < iterations; i++) {
        let newResult = "";
        for (let char of result) {
            if (char === 'F') {
                newResult += rule;
            } else {
                newResult += char;
            }
        }
        result = newResult;
    }
    return result;
}

// Функция для рисования фрактала
function drawLSystem(ctx, instructions, angle, length) {
    let x = offsetX; // Начальная позиция с учетом смещения
    let y = offsetY;
    let currentAngle = 45;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let command of instructions) {
        if (command === 'F') {
            x += length * Math.cos(currentAngle);
            y += length * Math.sin(currentAngle);
            ctx.lineTo(x, y);
        } else if (command === '+') {
            currentAngle += angle;
        } else if (command === '-') {
            currentAngle -= angle;
        }
    }

    ctx.stroke();
}

// Функция для перерисовки фрактала
function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка холста
    ctx.save(); // Сохранение текущего состояния контекста
    ctx.scale(scale, scale); // Установка масштаба
    drawLSystem(ctx, instructions, angle, length); // Рисование фрактала
    ctx.restore(); // Восстановление состояния контекста
}

// Функция для обновления строки инструкций и перерисовки фрактала
function updateAndRedraw() {
    instructions = generateLSystem(axiom, rule, iterations); // Генерация строки фрактала
    redraw(); // Перерисовка
}

// Генерация строки фрактала и начальная отрисовка
let instructions = generateLSystem(axiom, rule, iterations);
redraw(); // Начальная отрисовка фрактала

// Обработчик события нажатия кнопки мыши
canvas.addEventListener("mousedown", function (e) {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
});

// Обработчик события отпускания кнопки мыши
canvas.addEventListener("mouseup", function (e) {
    isDragging = false;
});

// Обработчик события перемещения мыши
canvas.addEventListener("mousemove", function (e) {
    if (isDragging) {
        // Вычисление смещения
        let dx = e.offsetX - startX;
        let dy = e.offsetY - startY;

        // Обновление положения фрактала с учетом масштаба
        offsetX += dx / scale;
        offsetY += dy / scale;

        // Обновление начальных координат для следующего смещения
        startX = e.offsetX;
        startY = e.offsetY;

        // Перерисовка фрактала с новыми координатами
        redraw();
    }
});

// Обработчик события изменения в поле итераций
inputElem.addEventListener("change", function () {
    // Проверяем, является ли введенное значение числом
    if (!isNaN(inputElem.value) && inputElem.value !== "") {
        // Преобразуем в число и обновляем количество итераций
        iterations = Number(inputElem.value);
        updateAndRedraw(); // Перерисовываем фрактал
    }
});

// Обработчик события изменения в поле длины
inputWidth.addEventListener("change", function () {
    if (!isNaN(inputWidth.value) && inputWidth.value !== "") {
        // Преобразуем в число и обновляем количество итераций
        length = Number(inputWidth.value);
        updateAndRedraw(); // Перерисовываем фрактал
    }
});

// Проверяем видимость и перерисовываем при загрузке страницы
toggleIteratorVisibility();
