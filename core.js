document.addEventListener('DOMContentLoaded', function() {
    
    const cursorArrow = document.getElementById('cursorArrow');
    const starsCanvas = document.getElementById('starsCanvas');
    const starsSection = document.getElementById('starsSection');
    const messageSection = document.getElementById('messageSection');
    const introTextEl = document.getElementById('introText');
    const happyTextEl = document.getElementById('happyText');
    
    const ctx = starsCanvas.getContext('2d');
    
    // ========== НАСТРОЙКИ ==========
    const fallSpeed = 1.1;      // Скорость падения
    const numberSize = 22;       // Размер цифр (чуть чуть чуть больше)
    const totalNumbers = 180;    // Количество падающих цифр
    // ================================
    
    let numbers = [];
    let falling = false;
    let animationId = null;
    let introShown = false;
    let scrollStarted = false;
    
    // Функция для печати текста по буквам
    function typeText(element, text, callback) {
        element.textContent = '';
        element.classList.add('visible');
        let index = 0;
        
        function addLetter() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(addLetter, 150);
            } else if (callback) {
                setTimeout(callback, 500);
            }
        }
        addLetter();
    }
    
    // Рисование цифры "24"
    function drawNumber(ctx, x, y, size, opacity, rotation) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(255, 220, 100, 0.8)';
        ctx.font = `${size}px "Courier New", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = opacity;
        
        // Немного поворачиваем для эффекта
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Градиент для цифр
        const gradient = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.5, '#ffdd88');
        gradient.addColorStop(1, '#ffaa44');
        ctx.fillStyle = gradient;
        
        ctx.fillText('24', 0, 0);
        ctx.restore();
    }
    
    // Создание падающих цифр
    function createNumbers() {
        numbers = [];
        for (let i = 0; i < totalNumbers; i++) {
            numbers.push({
                x: 30 + Math.random() * (starsCanvas.width - 60),
                y: -50 - Math.random() * 600,
                size: numberSize + (Math.random() * 6 - 3),
                speed: fallSpeed * (0.5 + Math.random() * 1),
                opacity: 0.5 + Math.random() * 0.5,
                rotation: (Math.random() - 0.5) * 0.3,
                finished: false
            });
        }
    }
    
    // Рисование всех цифр
    function drawNumbers() {
        ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
        for (let num of numbers) {
            if (!num.finished) {
                drawNumber(ctx, num.x, num.y, num.size, num.opacity, num.rotation);
            }
        }
    }
    
    // Обновление падения
    function updateNumbers() {
        let allFinished = true;
        for (let num of numbers) {
            if (!num.finished) {
                allFinished = false;
                num.y += num.speed;
                if (num.y > starsCanvas.height + 100) {
                    num.finished = true;
                }
            }
        }
        drawNumbers();
        
        if (allFinished && falling && !introShown) {
            falling = false;
            if (animationId) cancelAnimationFrame(animationId);
            console.log('Все цифры упали');
            typeText(introTextEl, 'Шок твой единственный брательник не поздравил тя (', function() {
                console.log('Надпись показана');
                setTimeout(scrollToMessage, 1000);
            });
            introShown = true;
        } else if (falling) {
            animationId = requestAnimationFrame(updateNumbers);
        }
    }
    
    // Плавный скролл к поздравлению
    function scrollToMessage() {
        if (scrollStarted) return;
        scrollStarted = true;
        console.log('Скроллим вниз');
        
        starsSection.style.transition = 'opacity 0.5s';
        starsSection.style.opacity = '0';
        
        setTimeout(function() {
            messageSection.classList.add('visible');
            messageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            setTimeout(function() {
                console.log('Показываем поздравление');
                typeText(happyTextEl, ' (С днюхой братан) <3, теперь хоть и с опозданием но он тебя поздравил ', null);
            }, 800);
        }, 500);
    }
    
    // Обновление размеров канваса
    function resizeCanvas() {
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;
        if (numbers.length > 0) drawNumbers();
    }
    
    // Запуск падения
    function startFalling() {
        if (falling) return;
        console.log('Запуск падения цифр 24');
        falling = true;
        introShown = false;
        scrollStarted = false;
        
        starsSection.style.opacity = '1';
        introTextEl.classList.remove('visible');
        introTextEl.textContent = '';
        happyTextEl.classList.remove('visible');
        happyTextEl.textContent = '';
        
        resizeCanvas();
        createNumbers();
        drawNumbers();
        animationId = requestAnimationFrame(updateNumbers);
    }
    
    // Нажатие на стрелку
    cursorArrow.addEventListener('click', function(e) {
        e.preventDefault();
        cursorArrow.classList.add('hidden');
        startFalling();
    });
    
    cursorArrow.addEventListener('touchstart', function(e) {
        e.preventDefault();
        cursorArrow.classList.add('hidden');
        startFalling();
    });
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    console.log('Готово! Нажми на стрелку, полетят цифры 24');
});