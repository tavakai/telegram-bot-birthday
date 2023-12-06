# Простой телеграм-бот напоминалка о днях рождения
### _Базовая версия работает только для одной группы_

![N|Solid](https://cdn-icons-png.flaticon.com/128/5292/5292438.png)

## Features

- Чтение и обработка сообщений
- Отправка уведомлений за день до дня рождения
- Персонализированное поздравление в день рождения
- Функционал дополняется...

## Tech

- [node-telegram-bot-api](https://www.npmjs.com/package/node-telegram-bot-api) - библиотека для создания ботов
- [node-cron](https://www.npmjs.com/package/node-cron) - популярный инструмент в Unix-системах, который помогает запланировать исполнение различных заданий прямо в ОС
- [mustache](https://www.npmjs.com/package/mustache) - шаблонизатор


## Installation

```sh
npm i
npm start
```

env variables for production environments...

```sh
TOKEN=...
GROUP_ID=...
```
