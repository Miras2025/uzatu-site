// 1. КОНСТАНТАЛАР (Telegram деректері)
const token = '8668030843:AAHj08Tesh2W1gajMqHYNt8GeLv9sNu3rEU'; 
const chatId = '663718699';
const scriptURL = 'https://script.google.com/macros/s/AKfycbxLLOVRsCU6cnOWqkY4jpb4gVJLvV_uY9LTMkykQ4RWZEPL_YneYRIIfW0ojzZz_l_9rA/exec'; // Google Web App URL


// 2. ЭЛЕМЕНТТЕРДІ ТАБУ
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
const nameInput = document.getElementById('guestName');
const submitBtn = document.querySelector('.zayotrp');

// 3. МУЗЫКАНЫ БАСҚАРУ 🎵
// Пайдаланушы батырманы басқанда әуенді қосады/өшіреді
if (musicBtn && bgMusic) {
    musicBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play().catch(error => console.log("Музыканы қосу үшін сайтпен әрекеттесу керек"));
            musicBtn.innerHTML = '<div class="music-icon">⏸</div>';
            musicBtn.style.animation = "none"; // Ойнап тұрғанда анимацияны тоқтатуға болады
        } else {
            bgMusic.pause();
            musicBtn.innerHTML = '<div class="music-icon">🎵</div>';
        }
    });
}

// 4. ТАЙМЕР (КЕРІ САНАҚ) ⏳
// Тоидың күні: 14 маусым 2026, 18:00
const countdownDate = new Date("June 14, 2026 17:00:00").getTime();

const updateTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    // Күн, сағат, минут, секунд есептеу
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Экранға шығару (егер элементтер болса)
    if (document.getElementById("days")) {
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }

    // Уақыт аяқталса
    if (distance < 0) {
        clearInterval(updateTimer);
        const timerDisplay = document.getElementById("countdown");
        if (timerDisplay) timerDisplay.innerHTML = "<h3>Той басталды! ✨</h3>";
    }
}, 1000);

async function sendToSheets(name, answer, eventType) {
    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, answer: answer, event_type: eventType })
        });
        return true;
    } catch (error) {
        console.error("Кестеге жіберу қатесі:", error);
        return false;
    }
}

// 5. TELEGRAM-ҒА ЖІБЕРУ ФУНКЦИЯСЫ 🤖
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Жіберу қатесі:", error);
        return false;
    }
}

// 6. ЖАУАП БЕРУ БАТЫРМАСЫНЫҢ ЛОГИКАСЫ ✉️
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const name = nameInput.value.trim();
        const selectedOption = document.querySelector('input[name="zhauap"]:checked');

        // Валидация (тексеру)
        if (!name) {
            alert("Өтінеміз, есіміңізді жазыңыз! 😊");
            return;
        }
        if (!selectedOption) {
            alert("Жауап нұсқаларының бірін таңдаңыз! ✅");
            return;
        }

        // Батырманы уақытша блоктау (екі рет басылып кетпеуі үшін)
        submitBtn.disabled = true;
        submitBtn.innerText = "Жіберілуде...";
        const eventTitle = "🌸 Еркеназдың Ұзату тойы"; // Үйлену тойы сайтында атауын өзгертіңіз
        const answer = selectedOption.value;
        const fullMessage = `🌸 <b>Еркеназдың Ұзату тойы</b>\n\n👤 <b>Қонақ:</b> ${name}\n📋 <b>Шешімі:</b> ${answer}\n\n📅 <i>Жіберілген уақыты: ${new Date().toLocaleString('kk-KZ')}</i>`;

        const [tgSuccess] = await Promise.all([
            sendToTelegram(fullMessage),
            sendToSheets(name, answer, eventTitle)
        ]);

        if (tgSuccess) {
            alert("Жауабыңыз жіберілді! Рақмет! 🌸");
            nameInput.value = "";
            // Радио батырмаларды тазарту
            selectedOption.checked = false;
        } else {
            alert("Қате кетті. Интернетті тексеріп, қайтадан көріңіз. ❌");
        }

        // Батырманы қайта іске қосу
        submitBtn.disabled = false;
        submitBtn.innerText = "Жауапты жіберу";
    });
}
