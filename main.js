document.addEventListener('DOMContentLoaded', () => {
    loadConfectioners();
    
    document.getElementById('confectionerForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Предотвращаем отправку формы
        
        // Получаем значения из полей ввода
        const name = document.getElementById('name').value;
        const source = document.getElementById('source').value;
        const activity = document.getElementById('activity').value;
        const telegram = document.getElementById('telegram').value || "Не указан";
        const instagram = document.getElementById('instagram').value || "Не указан";
        const phone = document.getElementById('phone').value || "Не указан";

        // Создаем объект нового кондитера
        const newConfectioner = {
            name: name,
            source: source,
            activity: activity,
            telegram: telegram,
            instagram: instagram,
            phone: phone,
            contacted: false
        };

        // Сохраняем нового кондитера в localStorage
        saveConfectioner(newConfectioner);
        updateConfectionersList();
        document.getElementById('confectionerForm').reset(); // Сбрасываем форму
    });
});

// Функция сохранения нового кондитера
function saveConfectioner(confectioner) {
    const confectioners = loadConfectionersFromLocalStorage();
    confectioners.push(confectioner);
    localStorage.setItem('confectioners', JSON.stringify(confectioners));
}

// Функция загрузки кондитеров из localStorage
function loadConfectioners() {
    const confectioners = loadConfectionersFromLocalStorage();
    const listContainer = document.getElementById('confectionersList');
    listContainer.innerHTML = ""; // Очищаем предыдущий список

    if (confectioners.length === 0) {
        listContainer.innerHTML = "<p>Список кондитеров пуст.</p>";
        return;
    }

    const table = document.createElement('table');
    table.classList.add('table');
    const header = `
        <tr>
            <th>Имя</th>
            <th>Источник</th>
            <th>Деятельность</th>
            <th>Telegram</th>
            <th>Instagram</th>
            <th>Номер</th>
            <th>Связались</th>
            <th>Удалить</th>
        </tr>
    `;
    table.innerHTML = header;

    confectioners.forEach((confectioner, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${confectioner.name}</td>
            <td>${confectioner.source}</td>
            <td>${confectioner.activity}</td>
            <td>${confectioner.telegram}</td>
            <td>${confectioner.instagram}</td>
            <td>${confectioner.phone}</td>
            <td>
                <button class="action-button contacted-button" onclick="toggleContacted(${index})">
                    ${confectioner.contacted ? 'Да' : 'Нет'}
                </button>
            </td>
            <td>
                <button class="action-button delete-button" onclick="deleteConfectioner(${index})">Удалить</button>
            </td>
        `;
        table.appendChild(row);
    });

    listContainer.appendChild(table);
}

// Функция загрузки кондитеров из localStorage
function loadConfectionersFromLocalStorage() {
    const confectionersJSON = localStorage.getItem('confectioners');
    return confectionersJSON ? JSON.parse(confectionersJSON) : [];
}

// Функция удаления кондитера
function deleteConfectioner(index) {
    const confectioners = loadConfectionersFromLocalStorage();
    confectioners.splice(index, 1); // Удаляем кондитера
    localStorage.setItem('confectioners', JSON.stringify(confectioners));
    loadConfectioners(); // Обновляем список
}

// Функция переключения статуса "Связались"
function toggleContacted(index) {
    const confectioners = loadConfectionersFromLocalStorage();
    confectioners[index].contacted = !confectioners[index].contacted; // Переключаем статус
    localStorage.setItem('confectioners', JSON.stringify(confectioners));
    loadConfectioners(); // Обновляем список
}
