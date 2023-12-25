import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        messageColor: '#FAFAFB',
        messageSize: '16px',
        messageLineHeight: '1.5',
        backgroundColor: '#EF4040',
        position: 'topRight',
        closeOnEscape: true,
        timeout: 5000,
      });
    } else {
      startBtn.disabled = false;
      userSelectedDate = selectedDates[0];
    }

    console.log(selectedDates[0]);
  },
};

const input = document.getElementById('datetime-picker');
const startBtn = document.querySelector('[data-start]');
startBtn.disabled = true;

const daysTimer = document.querySelector('[data-days]');
const hoursTimer = document.querySelector('[data-hours]');
const minutesTimer = document.querySelector('[data-minutes]');
const secondsTimer = document.querySelector('[data-seconds]');

let userSelectedDate = '';

const datePicker = flatpickr(input, options);

input.addEventListener('focus', () => {
  datePicker.config.defaultDate = new Date();
});

let intervalId;

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;

  const currentTime = new Date().getTime();
  const selectedTime = userSelectedDate.getTime();
  let countdownInterval = selectedTime - currentTime;

  const time = convertMs(countdownInterval);
  updateTimerDisplay(time);

  intervalId = setInterval(() => {
    countdownInterval -= 1000;
    const updatedTime = convertMs(countdownInterval);
    updateTimerDisplay(updatedTime);

    if (countdownInterval <= 1000) {
      clearInterval(intervalId);
      startBtn.disabled = false;
    }
  }, 1000);

  input.value = '';
});

function updateTimerDisplay(time) {
  daysTimer.textContent = addLeadingZero(time.days);
  hoursTimer.textContent = addLeadingZero(time.hours);
  minutesTimer.textContent = addLeadingZero(time.minutes);
  secondsTimer.textContent = addLeadingZero(time.seconds);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
