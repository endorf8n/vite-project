import { Notify } from "notiflix/build/notiflix-notify-aio"; //підключення бібліотеки notiflix, відображення сповіщень

const form = document.querySelector(".form"); //знаходимо елемент з класом form

//додаємо слухача на форму, при сабміті створюється проміс
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Зупиняє стандартну поведінку форми при сабміті

  const delay = parseInt(form.delay.value, 10); // Отримуємо значення затримки в числовому вигляді(значення поля input)
  const state = form.state.value; // Отримуємо значення вибраної радіокнопки (fulfilled або rejected)

  // Створення промісу
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay); // Якщо обрано fulfilled, викликаємо resolve
      } else {
        reject(delay); // Якщо обрано rejected, викликаємо reject
      }
    }, delay); // Затримка виконання промісу
  });

  // Обробка результатів промісу
  promise
    .then((resolvedDelay) => {
      Notify.success(`✅ Fulfilled promise in ${resolvedDelay}ms`);
    })
    .catch((rejectedDelay) => {
      Notify.failure(`❌ Rejected promise in ${rejectedDelay}ms`);
    });
  form.reset();
});
