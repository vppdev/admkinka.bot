const confectionersList = document.querySelector('#confectionersList tbody');
const confectionerForm = document.getElementById('confectionerForm');

// Загружаем кондитеров из Local Storage при загрузке страницы
document.addEventListener('DOMContentLoaded', loadConfectioners);

confectionerForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const newConfectioner = {
        name: document.getElementById('name').value,
        source: document.getElementById('source').value,
        activity: document.getElementById('activity').value,
        telegram: document.getElementById('telegram').value,
        instagram: document.getElementById('instagram').value,
        phone: document.getElementById('phone').value,
        contacted: false // поле для отслеживания контакта
    };

    addConfectioner(newConfectioner);
    confectionerForm.reset(); // Сбрасываем форму
});

// Добавляем кондитера
function addConfectioner(confectioner) {
    let confectioners = getConfectioners();
    confectioners.push(confectioner);
    saveConfectioners(confectioners);
    renderConfectioners();
}

// Получаем список кондитеров из Local Storage
function getConfectioners() {
    const confectioners = localStorage.getItem('confectioners');
    return confectioners ? JSON.parse(confectioners) : [];
}

// Сохраняем список кондитеров в Local Storage
function saveConfectioners(confectioners) {
    localStorage.setItem('confectioners', JSON.stringify(confectioners));
}

// Загружаем кондитеров и отображаем их на странице
function loadConfectioners() {
    renderConfectioners();
}

// Отображаем список кондитеров
function renderConfectioners() {
    confectionersList.innerHTML = ''; // очищаем текущий список
    const confectioners = getConfectioners();
    confectioners.forEach((confectioner, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${confectioner.name}</td>
            <td>${confectioner.source}</td>
            <td>${confectioner.activity}</td>
            <td>${confectioner.telegram}</td>
            <td>${confectioner.instagram}</td>
            <td>${confectioner.phone}</td>
            <td><button onclick="toggleContacted(${index})">${confectioner.contacted ? 'Связались' : 'Не связались'}</button></td>
            <td><button onclick="deleteConfectioner(${index})">Удалить</button></td> <!-- Кнопка для удаления -->
        `;
        confectionersList.appendChild(tr);
    });
}

// Меняем статус контакта
function toggleContacted(index) {
    let confectioners = getConfectioners();
    confectioners[index].contacted = !confectioners[index].contacted;
    saveConfectioners(confectioners);
    renderConfectioners();
}

// Удаляем кондитера
function deleteConfectioner(index) {
    let confectioners = getConfectioners();
    confectioners.splice(index, 1); // Удаляем кондитера из массива
    saveConfectioners(confectioners); // Сохраняем обновленный список
    renderConfectioners(); // Перерисовываем список
}
