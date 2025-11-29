//Всё будем хранить в одном файле, в следующем курсе всё будем хранить в отдельных модулях
'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY'; //храним ключи, В дальнейшем на TypeScripte это понадобиться 
let globalActiveHabbitId;

//page
const page = {                  //Описывает работу Меню
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')    
    },
    content: {
        daysContainer: document.getElementById('days'), //Обращаемся к диву с днями
        nextDay: document.querySelector('.habbit__day')  //Обращаемся на прямую ко дню
    },
    popup: {
        index: document.getElementById('add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}



// utils
//Функция получения данных от пользователя 
function loadData() {                   //localStorage.getItem() — это метод в JavaScript, используемый для получения значения, сохраненного в localStorage
    const habbitsString = localStorage.getItem('HABBIT_KEY'); //Если у нас есть ключи их лучше хранить в отдел. константе
    const habbitArray = JSON.parse(habbitsString); //Получили велью, теперь его нужно распарсить JSON.parse() — это метод JavaScript, который преобразует строку в формате JSON обратно в объект JavaScript.

    //Для минимальной проверки данных для ошибки, на массив сделаем миним. проверку
    if (Array.isArray(habbitArray)) { //isArray метод проверяет на массив, если да то true, если нет то false
        habbits = habbitArray;
    }            
}
//Функция сохранения
function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits)); //localStorage.setItem() — это метод в JavaScript, который используется для сохранения данных в локальном хранилище браузера.
}

//popup
function togglePopup() {
    if (page.popup.index.classList.contains('cover_hidden')){
        page.popup.index.classList.remove('cover_hidden');
    } else {
        page.popup.index.classList.add('cover_hidden');
    }

}

function resetForm(form, fields) {
     for (const field of fields) {
       form[field].value = '';
    }
}

function validateAndGetFormData(form, fields) {
    const formData = new FormData(form);
    const res = {};
    for (const field of fields) {
       const fieldValue = formData.get(field); 
       form[field].classList.remove('error');
        if(!fieldValue) {
        form[field].classList.add('error'); 
    }
    res[field] = fieldValue;
    }
    let isValid = true;
    for (const field of fields) {
        if (!res[field]) {
            isValid = false;
        }
    }
    if (!isValid) {
        return;
    }
    return res;
}

//render
function rerenderMenu(activeHabbit) {
    //Если у нас есть значение хеббитАйди, то мы идем по массиву
    for (const habbit of habbits) {
       const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`); //Задаём индетифик в хтмл файле и сюда привязываем к квериСелектору
        if (!existed) {  //Если нет, то создаем
            //Создание
            const element = document.createElement('button');        //Создаём кнопку
            element.setAttribute('menu-habbit-id', habbit.id);      //Добавляем атрибут в дальнейшем для поиска. Чтобы потом при следующем ререндере его найти
            element.classList.add('menu__item');
            element.addEventListener('click', () => rerender(habbit.id))     //Добавляем обработчки событий, в дальнейшем для вызова ререндера
            element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}"/>`;//Сюда кладём наш ИМГ
            if (activeHabbit.id === habbit.id) {                         
                element.classList.add('menu__item_active');
            }
            page.menu.appendChild(element);                                                //Теперь при обращении к меню и добавляем дочерний элемент
            continue;                                               //Добавили, так как у нас нарушена логика, и чтобы мы перешли к след. элемент. цикла
        }
            if (activeHabbit.id === habbit.id) {                         //Привычки которые мы проходимся с помощью классЛиста, добавляем название актив эл-лт.
            existed.classList.add('menu__item_active');
        } else {
            existed.classList.remove('menu__item_active');          //Если нет, не активный, удаляем
        }
    }
}
//Рендер шапки
function renderHead(activeHabbit){
    page.header.h1.innerText = activeHabbit.name;
    //Пишем тернарный оператор для подсчета прогресс бара
    const progress = activeHabbit.days.length / activeHabbit.target > 1 //Условие
    ? 100                                                               //true
    : activeHabbit.days.length / activeHabbit.target * 100;             //false
    page.header.progressPercent.innerText = progress.toFixed(0) + ' %';       //toFixed помогает округлять до целого числа, даже дробные
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`); //увеличивает полоску прогресс бара
}
//По сути каждый раз мы очищаем и для каждого дня мы пересоздаём
function rerenderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = '';                               //Нужно обнулить дни
    for (const index in activeHabbit.days){                                 //Проходимся по дням
        const element = document.createElement('div');                      //Создаём див с классом habbit
        element.classList.add('habbit');
        element.innerHTML = `
        <div class="habbit__day">День ${Number(index) + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button class="habbit__delete" onclick="deleteDay(${index})">
        <img src="./images/delete.svg" alt="Удалить день ${(index) + 1}" />
        </button>
        `;

        page.content.daysContainer.appendChild(element);                    //Добавляем в качестве child элемента 
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
}


function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit){           //Проверка если у нас нет хеббитАйди в шапке ничего не выполняем
        return;
    }
    document.location.hash = activeHabbitId;
    document.location.replace(document.location.pathname + '#' + activeHabbitId);
    rerenderMenu(activeHabbit);
    renderHead(activeHabbit);
    rerenderContent(activeHabbit);
}

//work with days
function addDays(event) {
    event.preventDefault();         //Отменяет действие браузера по умолчанию для конкретного события. 
    const data = validateAndGetFormData(event.target, ['comment']);
    if (!data) {
        return;
    }
    habbits = habbits.map( habbit => {
        if (habbit.id === globalActiveHabbitId) {   //Если у нас совпдает, то мы находимся в нужной привычке
            return {
                ...habbit,                  //Обращаемся спред, чтобы использовать данные массива и добавить новые
                days: habbit.days.concat([{comment: data.comment}])    //Используем конкатенацию, так придёт новый массив             
            }
        }
        return habbit;
    });
    resetForm (event.target, ['comment']);
    rerender(globalActiveHabbitId);
    saveData();

}

// delete day

function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {   //Проверка что в текущей привычке
            habbit.days.splice(index, 1);           //Обращаемся к days splice() для удаления по индексу или диапазону
            return {
                ...habbit,
                days: habbit.days
            };
        }
        return habbit                              //Иначе ничего не делаем и возвращаем habbit
    });
    rerender(globalActiveHabbitId);
    saveData();
}

// working with habbits

function setIcon(context, icon) {
    page.popup.iconField.value = icon;
    const activeIcon = document.querySelector('.icon.icon_active');
    activeIcon.classList.remove('icon_active');
    context.classList.add('icon_active');
}

function addHabbit(event) {
    event.preventDefault();         //Отменяет действие браузера по умолчанию для конкретного события. 
    const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
    if (!data) {
        return;
    }
    const maxId = habbits.reduce((acc, habbit) => acc > habbit.id ? acc : habbit.id, 0);
    habbits.push ({
        id: maxId + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    });
    resetForm(event.target, ['name','target'])
    togglePopup();
    saveData();
    rerender(maxId + 1);
}

const welcomePopup = document.getElementById('welcome-popup');
function toggleWelcomePopup() {
  if (welcomePopup.classList.contains('cover_hidden')) {
    welcomePopup.classList.remove('cover_hidden');
  } else {
    welcomePopup.classList.add('cover_hidden');
  }
}


//init
//Для того чтобы инициализация была один раз будем использовать Intermediate local function в виде стрелоч. функции
// и в рамках этой функции будем исполнять loadData()
(() => {
  loadData();
  if (habbits.length === 0) {
    // Если привычек нет, показываем приветственное окно
    toggleWelcomePopup();
    return; // дальше рендерить нечего
  }

  const hashId = Number(document.location.hash.replace('#', ''));
  const urlHabbit = habbits.find(habbit => habbit.id == hashId);
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();


//Добавили минимально данных для динам. проверки, потому что без данных это будет трудно сделать
