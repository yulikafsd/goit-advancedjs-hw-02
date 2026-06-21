import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const refs = {
    dateInput: document.querySelector('#datetime-picker'),
    startBtn: document.querySelector('[data-start]'),
    fieldValues: document.querySelectorAll('.field .value'),
};

// Variables to save user selected date and intervalId
let userSelectedDate;
let countDownId;

// Flatpickr onClose handler
function onClose(selectedDates) {
    // Save the date
    userSelectedDate = selectedDates[0];

    // Check if the date is in past
    const msFromNow = userSelectedDate - Date.now();
    const isInPast = msFromNow < 0;

    if (isInPast) {
        refs.startBtn.disabled = true;
        iziToast.error({
            position: 'topRight',
            title: 'Error',
            message: 'Please choose a date in the future',
        });
        return;
    }

    // Activate start button
    refs.startBtn.disabled = false;
}

// Flatpickr options
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose,
};

flatpickr(refs.dateInput, options);

// Convert milliseconds to units of time
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

//Function to format date units to XX format
function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}

//Start Button onClick handler
const onClick = e => {
    e.preventDefault();

    // Disable start button and date input
    refs.startBtn.disabled = true;
    refs.dateInput.disabled = true;

    // One step of the timer
    const updateTimer = () => {
        //Check if the date is in the past
        const msFromNow = userSelectedDate - Date.now();

        if (msFromNow <= 0) {
            clearInterval(countDownId);

            refs.fieldValues.forEach(fieldValue => {
                fieldValue.innerHTML = '00';
            });

            refs.dateInput.disabled = false;
            return;
        }

        // Convert miliseconds to date units in XX format
        const dateValues = Object.values(convertMs(msFromNow));
        const formattedValues = dateValues.map(addLeadingZero);

        // Show units in interface
        refs.fieldValues.forEach((fieldValue, index) => {
            if (formattedValues[index] !== undefined) {
                fieldValue.innerHTML = formattedValues[index];
            }
        });
    };

    // Call the function on click
    updateTimer();

    // Set interval
    countDownId = setInterval(updateTimer, 1000);
};

refs.startBtn.addEventListener('click', onClick);
