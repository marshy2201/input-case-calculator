const form = document.getElementById('form');
const input = document.querySelector('input');
const tBody = document.querySelector('tbody');
const span = document.querySelector('#totalCases span');

//case total calculation
function caseTotal() {
    const totalCases = document.getElementById('totalCases');
    const caseInputs = document.querySelectorAll('td:nth-child(2) input');

    let total = 0;
    for (let i = 0; i < caseInputs.length; i++) {
        total += parseInt(caseInputs[i].value);
        if (isNaN(total)) {
            total = '';
        }
    }
    span.textContent = total;
    totalCases.appendChild(span);
}

//each aisle time required calculation
function timeRequired(e) {
    const input = e.target;
    const mins = (input.value / 35) * 60;
    const hours = Math.floor(mins / 60);
    const minsLeft = mins % 60;
    const span = input.parentNode.nextElementSibling.children[0];
    span.innerHTML = hours.toFixed(0) + ' hour(s) <br />' + minsLeft.toFixed(0) + ' min(s)';
}

//total time required calculation
function totalTime() {
    let mins = span.innerHTML;
    mins = (mins / 35) * 60;
    const hours = Math.floor(mins / 60);
    const minsLeft = mins % 60;
    const totalTimeSpan = document.querySelector('#totalTime span');
    totalTimeSpan.innerHTML = hours.toFixed(0) + ' hour(s) <br />' + minsLeft.toFixed(0) + ' min(s)';
}

//remove tr attributes
function removeStyle() {
    const tr = document.getElementsByTagName('tr');
    for (let i = 0; i < tr.length; i++) {
        tr[i].removeAttribute('style');
    }
}

//add table row with elements
form.addEventListener('submit', function (e) {
    e.preventDefault();
    const tr = document.createElement('tr');
    const lastTR = tBody.querySelector('tr:last-child');

    if (input.value != '') {

        for (let i = 0; i < 3; i++) {
            const td = document.createElement('td')
            tr.appendChild(td);

            if (tr.children[i] === tr.children[0]) {
                const span = document.createElement('span');
                span.textContent = input.value;
                tr.children[0].appendChild(span);
                input.value = '';
            } else if (tr.children[i] === tr.children[1]) {
                const inputCase = document.createElement('input');
                inputCase.type = 'number';
                inputCase.value = 0;
                tr.children[1].appendChild(inputCase);
            } else if (tr.children[i] === tr.children[2]) {
                const span = document.createElement('span');
                tr.children[2].appendChild(span);

                const mainDiv = document.createElement('div');
                tr.appendChild(mainDiv);

                for (let i = 0; i < 2; i++) {
                    const div = document.createElement('div');
                    mainDiv.appendChild(div);
                }

                const div1 = mainDiv.getElementsByTagName('div')[0];
                const div2 = mainDiv.getElementsByTagName('div')[1];

                const buttonEdit = document.createElement('button');
                const buttonRemove = document.createElement('button');
                const buttonUp = document.createElement('button');
                const buttonDown = document.createElement('button');
                buttonEdit.textContent = 'edit';
                buttonRemove.textContent = 'remove';
                buttonUp.innerHTML = '&uarr;';
                buttonDown.innerHTML = '&darr;';
                div1.appendChild(buttonEdit);
                div1.appendChild(buttonRemove);
                div2.appendChild(buttonUp);
                div2.appendChild(buttonDown);
            }
        }

        tBody.insertBefore(tr, lastTR);
        input.placeholder = 'Input here...'

    } else {
        input.placeholder = 'Please enter an aisle';
    }


});

//click events
tBody.addEventListener('click', function (e) {
    //remove and edit rows
    if (e.target.tagName === 'BUTTON') {
        const button = e.target;
        const tr = button.parentNode.parentNode.parentNode;
        const td = button.parentNode.parentNode.parentNode.firstElementChild;

        //remove tr style attribute
        removeStyle()

        if (button.textContent === 'remove') {
            tBody.removeChild(tr);
        } else if (button.textContent === 'edit') {
            const span = td.firstElementChild;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = span.textContent;
            td.insertBefore(input, span);
            td.removeChild(span);
            button.textContent = 'save';
        } else if (button.textContent === 'save') {
            const input = td.firstElementChild;
            const span = document.createElement('span');
            span.textContent = input.value;
            td.insertBefore(span, input);
            td.removeChild(input);
            button.textContent = 'edit';
        } else if (button.textContent === '?') {
            tr.style.backgroundColor = 'rgba(77, 142, 11, .5)';
            if (!(tr.previousElementSibling === document.querySelector('tr:first-child'))) {
                const prevTr = tr.previousElementSibling;
                tBody.insertBefore(tr, prevTr);
            }
        } else if (button.textContent === '?') {
            tr.style.backgroundColor = 'rgba(77, 142, 11, .5)';
            if (!(tr.nextElementSibling === document.querySelector('tr:last-child'))) {
                const nextTr = tr.nextElementSibling;
                tBody.insertBefore(nextTr, tr);
            }
        }
    }
    //input value appears blank on click
    if (e.target.tagName === 'INPUT') {
        if (e.target.value === '0') {
            e.target.value = '';
        }
    }
    if (e.target.textContent === 'remove') {
        caseTotal();
    }
});

//calculate input values
tBody.addEventListener('keyup', function (e) {
    if (e.target.tagName === 'INPUT') {
        caseTotal();
        timeRequired(e);
        totalTime();
    }
});

document.addEventListener('mouseover', function (e) {
    if (e.target.className === 'wrapper') {
        //remove tr style attribute
        removeStyle();
    }
});