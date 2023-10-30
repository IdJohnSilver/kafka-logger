
## Нагрузочное тестирование

### Статья
https://habr.com/ru/companies/otus/articles/677214/

### Библиотека для конвертации json коллекции Postman в файл для проведения тестирования
https://github.com/apideck-libraries/postman-to-k6

### K6 - инструмент для проведения тестирования
https://k6.io/docs/using-k6/k6-options/how-to/

Пример запуска теста
```
k6 run --duration 10s --vus 2 k6-script-test.js
```