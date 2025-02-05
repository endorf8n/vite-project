import flatpickr from "flatpickr"; //підключення бібліотеки flatpickr
import "flatpickr/dist/flatpickr.min.css"; //додатковий імпорт стилів календаря
import { Notify } from "notiflix/build/notiflix-notify-aio"; // підключення бібліотеки notiflix, відображень сповіщень
import convertMs from "./convertMs"; // імпортуємо функцію convertMs

let intervalId = null; // змінна що зберігає ідентифікатор інтервалу
// об'єкт, що зберігає посилання на DOM елементи
const refs = {
  input: document.querySelector("#datetime-picker"),
  button: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};
// робимо кнопку неактивною перед тим як вибираємо дату
refs.button.disabled = true;
// додатковий об'єкт налаштувань, передбачений бібліотекою flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    //функція onClose яка весь час спрацьовує при закритті календаря, selectedDates - масив дат, обраних користувачем
    if (selectedDates[0] <= new Date()) {
      //перевірка чи вибрана користувачем дата в майбутньому, якщо ні, відповідне сповіщення про помилку
      Notify.failure("Please choose a date in the future", {
        timeout: 3000,
      });
    } else {
      Notify.success("Great choice, now you can start a timer)", {
        timeout: 3000,
      });
      refs.button.disabled = false;
    }
  },
};
// ініціалізація flatpickr на елементі input
flatpickr(refs.input, options);

// встановлення слухача на кнопку, при кліку запускається таймер
refs.button.addEventListener("click", () => {
  const selectedDate = new Date(refs.input.value); //присвоєння змінній selectedDate значення яке вибрав користувач у календарі

  refs.button.disabled = true; //встановлення неактивності кнопки
  refs.input.disabled = true; // встановлення неактивності інпута

  intervalId = setInterval(() => {
    const diff = selectedDate - new Date(); // визначення різниці між обраною датою і теперішнім моментом

    if (diff <= 0) {
      // перевірка чи різниця є плюсовою
      clearInterval(intervalId);
      refs.input.disabled = false; //встановлення інпутом активним після спливу таймера
      return;
    }
    const days = convertMs(diff).days;
    const hours = convertMs(diff).hours;
    const minutes = convertMs(diff).minutes;
    const seconds = convertMs(diff).seconds;

    refs.days.textContent = addLeadingZero(days);
    refs.hours.textContent = addLeadingZero(hours);
    refs.minutes.textContent = addLeadingZero(minutes);
    refs.seconds.textContent = addLeadingZero(seconds);
  }, 1000);
});
// функція для додавання 0 якщо цифр менше як дві
function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}
