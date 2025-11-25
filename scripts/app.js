//Всё будем хранить в одном файле, в следующем курсе всё будем хранить в отдельных модулях
'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY'; //храним ключи, В дальнейшем на TypeScripte это понадобиться 

//page
const page = {                  //Описывает работу Меню
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('.h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__cover-bar')    
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

//render
function rerenderMenu(activeHabbit) {
    if (!activeHabbit){           //Проверка если у нас нет хеббитАйди
        return;
    }
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
    if (!activeHabbit){           //Проверка если у нас нет хеббитАйди в шапке ничего не выполняем
        return;
    }
    page.header.h1.innerText = activeHabbit.name;
    //Пишем тернарный оператор для подсчета прогресс бара
    const progress = activeHabbit.days.length / activeHabbit.target > 1 //Условие
    ? 100                                                               //true
    : activeHabbit.days.length / activeHabbit.target * 100;             //false
    page.header.progressPercent.innerText = progress.toFixed(0) + ' %';       //toFixed помогает округлять до целого числа, даже дробные
    page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`); //увеличивает полоску прогресс бара
}

function rerender(activeHabbitId) {
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);  //
    rerenderMenu(activeHabbit);
    renderHead(activeHabbit);
}


//init
//Для того чтобы инициализация была один раз будем использовать Intermediate local function в виде стрелоч. функции
// и в рамках этой функции будем исполнять loadData()
(() => {
    loadData();
    rerenderMenu(habbits[0].id);
})();

//Добавили минимально данных для динам. проверки, потому что без данных это будет трудно сделать
