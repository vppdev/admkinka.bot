import logging
import json
from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.utils import executor

API_TOKEN = '7941922638:AAEMXSotBZbct2EpT1kJ-V4YqNr9YD8tuH8'  # Замените на ваш токен

# Включаем логирование
logging.basicConfig(level=logging.INFO)

# Инициализация бота и диспетчера
bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# Файл для хранения кондитеров
CONFECTIONERS_FILE = 'confectioners.json'

# Команда /start
@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    keyboard = types.ReplyKeyboardMarkup(resize_keyboard=True)
    button_open_site = types.KeyboardButton("Открыть сайт кондитеров")
    keyboard.add(button_open_site)
    
    await message.reply("Добро пожаловать! Нажмите на кнопку ниже, чтобы открыть сайт.", reply_markup=keyboard)

# Обработка нажатия на кнопку "Открыть сайт кондитеров"
@dp.message_handler(lambda message: message.text == "Открыть сайт кондитеров")
async def open_site(message: types.Message):
    await message.reply("Открываю сайт кондитеров...", disable_web_page_preview=True)
    keyboard = types.InlineKeyboardMarkup()
    button = types.InlineKeyboardButton("Перейти на сайт", url="https://adminkaxsvpp.netlify.app/")  # Укажите ваш URL
    keyboard.add(button)
    await message.answer("Нажмите на кнопку ниже, чтобы перейти на сайт:", reply_markup=keyboard)

# Добавление нового кондитера
@dp.message_handler(commands=['add_confectioner'])
async def add_confectioner(message: types.Message):
    parts = message.text.split()[1:]  # Получаем все части команды
    if len(parts) < 6:
        await message.reply("Используйте формат: /add_confectioner имя источник деятельность телеграм инстаграм номер")
        return
    
    new_confectioner = {
        "name": parts[0],
        "source": parts[1],
        "activity": parts[2],
        "telegram": parts[3] if parts[3] != "Не указан" else "Не указан",
        "instagram": parts[4] if parts[4] != "Не указан" else "Не указан",
        "phone": parts[5] if parts[5] != "Не указан" else "Не указан",
        "contacted": False  # по умолчанию не связались
    }

    # Сохранение в файл
    try:
        confectioners = load_confectioners()
        confectioners.append(new_confectioner)
        with open(CONFECTIONERS_FILE, 'w') as file:
            json.dump(confectioners, file)
        await message.reply("Кондитер добавлен успешно!")
    except Exception as e:
        await message.reply(f"Произошла ошибка при добавлении: {e}")

# Загрузка списка кондитеров
def load_confectioners():
    try:
        with open(CONFECTIONERS_FILE, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []

# Отображение списка кондитеров
@dp.message_handler(commands=['list_confectioners'])
async def list_confectioners(message: types.Message):
    confectioners = load_confectioners()
    if not confectioners:
        await message.reply("Список кондитеров пуст.")
    else:
        response = "Список кондитеров:\n"
        for c in confectioners:
            response += f"{c['name']} - {c['source']} - {c['activity']} - Telegram: {c['telegram']} - Instagram: {c['instagram']} - Номер: {c['phone']}\n"
        await message.reply(response)

if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=True)
