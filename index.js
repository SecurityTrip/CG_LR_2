let canvas = document.getElementById('drawFrac');
let ctx = canvas.getContext('2d');

let iterations = 0; // Текущая итерация (шаг)
let maxIterations = 10; // Максимальное количество итераций
let scale = 1; // Масштаб

// Параметры для фрактала
let axiom = "F+F+F";
let rule = "F-F+F";
let angle = (2 * Math.PI) / 3; // Угол поворота

let offsetX = canvas.width / 1.5; // Начальное смещение по X
let offsetY = canvas.height / 2; // Начальное смещение по Y

// Функция генерации L-системы для текущей итерации
function generateLSystem(axiom, rule, iterations) {
    let result = axiom;
    for (let i = 0; i < iterations; i++) {
        let newResult = '';
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

// Функция рисования пикселя
function drawPixel(x, y) {
    ctx.fillRect(x, y, 1, 1); // Рисуем пиксель 1x1
}

// Функция отрисовки фрактала с использованием пикселей
function drawFractal(instructions, length) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

    let x = offsetX; // Начальная позиция
    let y = offsetY;
    let currentAngle = 0; // Направление движения

    for (let command of instructions) {
        if (command === 'F') {
            // Вычисляем новые координаты
            let newX = x + length * Math.cos(currentAngle) * scale;
            let newY = y + length * Math.sin(currentAngle) * scale;

            // Рисуем пиксель по траектории движения
            let dx = newX - x;
            let dy = newY - y;
            // Вычисляем количество шагов для отрисовки линии через пиксели
            let steps = Math.max(Math.abs(dx), Math.abs(dy));

            for (let i = 0; i <= steps; i++) {
                let pixelX = x + (dx * i / steps);
                let pixelY = y + (dy * i / steps);
                // Рисуем пиксель
                drawPixel(pixelX, pixelY);
            }

            // Обновляем координаты
            x = newX;
            y = newY;
        } else if (command === '+') {
            currentAngle += angle; // Поворачиваем на + градусов
        } else if (command === '-') {
            currentAngle -= angle; // Поворачиваем на - градусов
        }
    }
}

// Функция для обновления и отрисовки следующего шага
function updateAndRedraw() {
    let instructions = generateLSystem(axiom, rule, iterations); // Генерируем строку L-системы
    let lineLength = 10; // Длина линии
    drawFractal(instructions, lineLength); // Рисуем фрактал
}

// Обработчик для кнопки "Следующий шаг"
document.getElementById('nextStep').addEventListener('click', function () {
    if (iterations < maxIterations) {
        iterations++;
        updateAndRedraw(); // Перерисовываем фрактал на каждом шаге
    }
});

// Обработчики для кнопок масштабирования
document.getElementById('zoomIn').addEventListener('click', function () {
    scale *= 1.2; // Увеличиваем масштаб
    updateAndRedraw(); // Перерисовываем фрактал
});

document.getElementById('zoomOut').addEventListener('click', function () {
    scale /= 1.2; // Уменьшаем масштаб
    updateAndRedraw(); // Перерисовываем фрактал
});

// Начальная отрисовка
updateAndRedraw();
