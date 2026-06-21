import iziToast from 'izitoast';

const form = document.querySelector('.form');

const onSubmit = e => {
    e.preventDefault();

    const state = form.elements.state.value;
    const currentDelay = Number(form.elements.delay.value);

    const createPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state == 'fulfilled') {
                resolve(`✅ Fulfilled promise in ${currentDelay}ms`);
            } else {
                reject(`❌ Rejected promise in ${currentDelay}ms`);
            }
        }, currentDelay);
    });

    createPromise
        .then(value => {
            iziToast.success({ position: 'topRight', message: value });
        })
        .catch(error => {
            iziToast.error({ position: 'topRight', message: error });
        });

    form.reset();
};

form.addEventListener('submit', onSubmit);
