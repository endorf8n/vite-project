import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import convertMs from "./convertMs";

let intervalId = null;

const refs = {
  input: document.querySelector("#datetime-picker"),
  button: document.querySelector("[data-start]"),
  days: document.querySelector("[data-days]"),
  hours: document.querySelector("[data-hours]"),
  minutes: document.querySelector("[data-minutes]"),
  seconds: document.querySelector("[data-seconds]"),
};

refs.button.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
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

flatpickr(refs.input, options);

refs.button.addEventListener("click", () => {
  const selectedDate = new Date(refs.input.value);

  refs.button.disabled = true;
  refs.input.disabled = true;

  intervalId = setInterval(() => {
    const diff = selectedDate - new Date();

    if (diff <= 0) {
      clearInterval(intervalId);
      refs.input.disabled = false;
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

function addLeadingZero(value) {
  return value.toString().padStart(2, "0");
}
