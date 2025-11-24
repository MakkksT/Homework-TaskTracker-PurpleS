//Всё будем хранить в одном файле, в следующем курсе всё будем хранить в отдельных модулях
'use strict';

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY'; //храним ключи, В дальнейшем на TypeScripte это понадобиться 
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
//Для того чтобы инициализация была один раз будем использовать Intermediate local function в виде стрелоч. функции
// и в рамках этой функции будем исполнять loadData()
(() => {
    loadData();
})()

//Добавили минимально данных для динам. проверки, потому что без данных это будет трудно сделать
