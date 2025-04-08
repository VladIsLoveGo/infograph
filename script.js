const data = {
  2009: { figma: 0, sketch: 0, adobexd: 0, others: 100 },
  2010: { figma: 0, sketch: 0, adobexd: 0, others: 100 },
  2011: { figma: 0, sketch: 10, adobexd: 0, others: 90 },
  2012: { figma: 0, sketch: 20, adobexd: 0, others: 80 },
  2013: { figma: 0, sketch: 25, adobexd: 0, others: 75 },
  2014: { figma: 0, sketch: 30, adobexd: 5, others: 65 },
  2015: { figma: 0, sketch: 30, adobexd: 10, others: 60 },
  2016: { figma: 10, sketch: 30, adobexd: 12, others: 48 },
  2017: { figma: 15, sketch: 28, adobexd: 14, others: 43 },
  2018: { figma: 20, sketch: 25, adobexd: 15, others: 40 },
  2019: { figma: 30, sketch: 23, adobexd: 15, others: 32 },
  2020: { figma: 35, sketch: 22, adobexd: 15, others: 28 },
  2021: { figma: 40, sketch: 20, adobexd: 15, others: 25 },
  2022: { figma: 45, sketch: 20, adobexd: 14, others: 21 },
  2023: { figma: 50, sketch: 20, adobexd: 14, others: 16 },
  2024: { figma: 55, sketch: 20, adobexd: 14, others: 11 },
  2025: { figma: 60, sketch: 20, adobexd: 15, others: 5 }
};

const toolDescriptions = {
  figma: "Figma — облачный инструмент для совместной работы над дизайном интерфейсов.",
  sketch: "Sketch — векторный редактор для macOS, популярный среди UI/UX дизайнеров.",
  adobexd: "Adobe XD — инструмент для проектирования и прототипирования от Adobe.",
  others: "Другие инструменты, включая Photoshop, Illustrator и т.д."
};

const toolDetails = {
  figma: {
    fullName: "Figma",
    year: 2016,
    features: "Figma — это облачный инструмент для проектирования интерфейсов и совместной работы в реальном времени. Поддерживает плагины, кроссплатформенность (доступен через браузер и настольные приложения), векторное редактирование, прототипирование и интеграцию с инструментами разработки, такими как Zeplin и Storybook. Отличается высокой скоростью работы и простотой обмена проектами.",
    popularity: (year) => data[year].figma,
    advantages: "Бесплатный базовый тариф, низкий порог вхождения, активное сообщество разработчиков плагинов.",
    disadvantages: "Требует стабильного интернета, ограниченные возможности оффлайн-работы."
  },
  sketch: {
    fullName: "Sketch",
    year: 2010,
    features: "Sketch — это векторный редактор, разработанный специально для macOS. Популярен среди UI/UX-дизайнеров благодаря поддержке символов, библиотек стилей, экспорта ресурсов для разработчиков и интеграции с такими инструментами, как Zeplin и Abstract. Основное внимание уделено проектированию интерфейсов, а не общей графике.",
    popularity: (year) => data[year].sketch,
    advantages: "Быстрое выполнение задач дизайна интерфейсов, мощная система символов, оптимизация под macOS.",
    disadvantages: "Доступен только на macOS, снижение популярности после появления Figma."
  },
  adobexd: {
    fullName: "Adobe Experience Design (XD)",
    year: 2016,
    features: "Adobe XD — инструмент для проектирования UI/UX и создания интерактивных прототипов. Интегрируется с Adobe Creative Cloud (Photoshop, Illustrator), поддерживает анимации, совместную работу в реальном времени (с версии 2019 года) и экспорт в популярные форматы. Подходит как для дизайнеров, так и для команд, работающих с продуктами Adobe.",
    popularity: (year) => data[year].adobexd,
    advantages: "Глубокая интеграция с экосистемой Adobe, поддержка сложных анимаций, бесплатный тариф с ограничениями.",
    disadvantages: "Менее интуитивен по сравнению с Figma, меньшее сообщество плагинов."
  },
  others: {
    fullName: "Другие инструменты",
    year: "—",
    features: "Сюда входят классические инструменты, такие как Adobe Photoshop (для растровой графики и детального дизайна), Adobe Illustrator (для векторных иллюстраций), InVision (для прототипирования и совместной работы), а также Axure RP (для сложных прототипов). Эти инструменты часто используются в сочетании с основными платформами или для специфических задач.",
    popularity: (year) => data[year].others,
    advantages: "Широкий спектр возможностей, проверенная временем репутация.",
    disadvantages: "Многие устаревают для современных задач UI/UX, высокая стоимость подписки."
  }
};

const years = Object.keys(data);
let currentIndex = 0;
let autoPlay = false;
let intervalId = null;

const tooltip = document.getElementById('tooltip');
const toolInfo = document.getElementById('tool-info');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevYearBtn = document.getElementById('prev-year');
const nextYearBtn = document.getElementById('next-year');
const playPauseBtn = document.getElementById('play-pause');
const chart = document.getElementById('chart');

function addYAxisLabels() {
  const svg = chart.querySelector('svg');
  if (!svg) {
    console.error('SVG элемент не найден');
    return;
  }

  const existingLabels = svg.querySelectorAll('.y-axis-label');
  existingLabels.forEach(label => label.remove());

  const maxHeight = window.innerWidth <= 480 ? 350 : window.innerWidth <= 768 ? 400 : 450;
  const yStart = 500;
  const yEnd = yStart - maxHeight;

  const labelXPosition = 55;
  const textAnchor = 'start';

  const labels = [
    { text: '0%', y: yStart + 15 },
    { text: '50%', y: yStart - (maxHeight / 2) },
    { text: '100%', y: yEnd - 15 }
  ];

  labels.forEach(label => {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', labelXPosition);
    text.setAttribute('y', label.y);
    text.setAttribute('class', 'y-axis-label axis-label');
    text.setAttribute('text-anchor', textAnchor);
    text.textContent = label.text;
    svg.appendChild(text);
  });
}

function addXAxisLabel() {
  const svg = chart.querySelector('svg');
  if (!svg) {
    console.error('SVG элемент не найден');
    return;
  }

  const existingLabel = svg.querySelector('.x-axis-label');
  if (existingLabel) existingLabel.remove();

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', parseFloat(svg.getAttribute('width')) / 2);
  text.setAttribute('y', 550);
  text.setAttribute('class', 'x-axis-label axis-label');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = 'Инструменты';
  svg.appendChild(text);
}

function updateChart(year) {
  const yearData = data[year];
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = year;
  } else {
    console.error('Элемент current-year не найден');
    return;
  }

  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768;

  const maxHeight = isMobile ? 350 : isTablet ? 400 : 450;
  const barWidth = isMobile ? 60 : isTablet ? 80 : 100;
  const svg = chart.querySelector('svg');
  const svgWidth = svg ? parseFloat(svg.getAttribute('viewBox').split(' ')[2]) : 900;

  const margin = 50;
  const availableWidth = svgWidth - 2 * margin;
  const barSpacing = availableWidth / 4;

  let barPositions;
  if (isMobile) {
    barPositions = [
      svgWidth / 2 - 210,
      svgWidth / 2 - 70,
      svgWidth / 2 + 70,
      svgWidth / 2 + 210
    ];
  } else if (isTablet) {
    barPositions = [
      margin + barSpacing * 0.5,
      margin + barSpacing * 1.5,
      margin + barSpacing * 2.5,
      margin + barSpacing * 3.5
    ];
  } else {
    barPositions = [
      margin + barSpacing * 0.5,
      margin + barSpacing * 1.5,
      margin + barSpacing * 2.5,
      margin + barSpacing * 3.5
    ];
  }

  ['figma', 'sketch', 'adobexd', 'others'].forEach((tool, index) => {
    const percentage = yearData[tool] || 0;
    const height = (percentage / 100) * maxHeight;
    const y = 500 - height;
    const xPos = barPositions[index];

    const barGroup = document.querySelector(`#${tool}`);
    if (!barGroup) {
      console.error(`Группа для ${tool} не найдена`);
      return;
    }

    const bar = barGroup.querySelector('rect');
    const valueText = barGroup.querySelector('.bar-value');
    const labelText = barGroup.querySelector('.bar-label');

    if (bar && valueText && labelText) {
      bar.setAttribute('x', xPos - barWidth / 2);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', height);
      bar.setAttribute('y', y);

      valueText.textContent = `${percentage}%`;
      valueText.setAttribute('x', xPos);
      if (height > 0) {
        valueText.setAttribute('y', y - 10);
        valueText.style.opacity = 1;
      } else {
        valueText.style.opacity = 0;
      }

      labelText.setAttribute('x', xPos);
      labelText.setAttribute('y', 530);
    } else {
      console.error(`Столбец или текст для ${tool} не найден`);
    }
  });

  addYAxisLabels();
  addXAxisLabel();
}

if (prevYearBtn) {
  prevYearBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + years.length) % years.length;
    updateChart(years[currentIndex]);
  });
}

if (nextYearBtn) {
  nextYearBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % years.length;
    updateChart(years[currentIndex]);
  });
}

const bars = document.querySelectorAll('.bar');
const isMobileDevice = () => window.innerWidth <= 768;

bars.forEach(bar => {
  if (!isMobileDevice()) {
    bar.addEventListener('mouseover', (event) => {
      if (!tooltip) return;
      const tool = bar.id;
      const percentage = data[years[currentIndex]][tool] || 0;
      tooltip.textContent = `${tool.charAt(0).toUpperCase() + tool.slice(1)}: ${percentage}% (${toolDescriptions[tool]})`;
      tooltip.classList.add('visible');
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    });

    bar.addEventListener('mousemove', (event) => {
      if (!tooltip) return;
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    });

    bar.addEventListener('mouseout', () => {
      if (!tooltip) return;
      tooltip.classList.remove('visible');
    });
  }

  bar.addEventListener('click', () => {
    if (!toolInfo) return;

    if (tooltip) {
      tooltip.classList.remove('visible');
    }

    const tool = bar.id;
    const details = toolDetails[tool];
    const percentage = details.popularity(years[currentIndex]);
    toolInfo.innerHTML = `
      <strong>${details.fullName}</strong><br>
      Год выпуска: ${details.year}<br>
      Особенности: ${details.features}<br>
      Популярность в ${years[currentIndex]}: ${percentage}%
    `;
    toolInfo.style.display = 'block';
    toolInfo.style.opacity = 0;
    toolInfo.style.transform = 'translate(-50%, 20px)';
    setTimeout(() => {
      toolInfo.style.opacity = 1;
      toolInfo.style.transform = 'translate(-50%, 0)';
    }, 10);
    setTimeout(() => {
      toolInfo.style.opacity = 0;
      toolInfo.style.transform = 'translate(-50%, 20px)';
      setTimeout(() => {
        toolInfo.style.display = 'none';
      }, 500);
    }, 5000);
  });
});

function toggleAutoPlay() {
  autoPlay = !autoPlay;
  if (playIcon && pauseIcon) {
    playIcon.style.display = autoPlay ? 'none' : 'block';
    pauseIcon.style.display = autoPlay ? 'block' : 'none';
  }
  if (autoPlay) {
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % years.length;
      updateChart(years[currentIndex]);
    }, 4000);
  } else {
    clearInterval(intervalId);
  }
}

if (playPauseBtn) {
  playPauseBtn.addEventListener('click', toggleAutoPlay);
}

try {
  updateChart(years[currentIndex]);
} catch (error) {
  console.error('Ошибка при инициализации графика:', error);
}

window.addEventListener('resize', () => {
  updateChart(years[currentIndex]);
});