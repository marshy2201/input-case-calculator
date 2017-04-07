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
    const spanValue = span.innerHTML;
    const mins = (spanValue / 35) * 60;
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

//create rows with elements
function createRow(text) {
    //create elements, property & value
    function createElement(elementType, property, value, property2, value2) {
        const element = document.createElement(elementType);
        element[property] = value;
        element[property2] = value2;
        return element;
    }

    //append elements to tr
    function appendToTr(elementType, property, value) {
        const element = createElement(elementType, property, value);
        tr.appendChild(element);
        return element;
    }

    //append buttons to mainDiv
    function appendToDiv(elementType, property, value) {
        const element = createElement(elementType, property, value);
        div.appendChild(element);
        return element;
    }

    const tr = document.createElement('tr');
    const div = document.createElement('div');

    appendToTr('td')
        .appendChild(createElement('span', 'textContent', text));
    appendToTr('td')
        .appendChild(createElement('input', 'type', 'number', 'value', 0));
    appendToTr('td')
        .appendChild(createElement('span'));
    tr.appendChild(div);
    appendToDiv('div')
        .appendChild(createElement('button', 'textContent', 'edit'))
        .parentNode.appendChild(createElement('button', 'textContent', 'remove'));
    appendToDiv('div')
         .appendChild(createElement('button', 'innerHTML', '&uarr;'))
         .parentNode.appendChild(createElement('button', 'innerHTML', '&darr;'));
    return tr;
}

//add table row with elements
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value != '') {
        const tr = createRow(input.value);
        const secondTR = tBody.querySelector('tr:nth-child(2)');
        tBody.insertBefore(tr, secondTR);

        input.placeholder = 'Input here...'
        input.value = '';
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
        const tdFirstElement = td.firstElementChild;

        //create elements, property & value
        function createElement(elementType, property, value, property2, value2, property3, value3) {
            const element = document.createElement(elementType);
            element[property] = value;
            element[property3] = value3;
            button[property2] = value2;
            return element;
        }

        //append elements
        function appendToTd(elementType, property, value, property2, value2, property3, value3) {
            const element2 = createElement(elementType, property, value, property2, value2, property3, value3);
            td.insertBefore(element2, tdFirstElement);
            td.removeChild(tdFirstElement);
            return element2;
        }

        //remove tr style attribute
        removeStyle();

        const nameActions = {
            remove: function () {
                tBody.removeChild(tr);
            },
            save: function () {
                appendToTd('span', 'textContent', tdFirstElement.value, 'textContent', 'edit');
            },
            edit: function () {
                appendToTd('input', 'type', 'text', 'textContent', 'save', 'value', tdFirstElement.textContent);
            },
            up: function () {
                tr.style.backgroundColor = 'rgba(77, 142, 11, .5)';
                if (!(tr.previousElementSibling === document.querySelector('tr:first-child'))) {
                    const prevTr = tr.previousElementSibling;
                    tBody.insertBefore(tr, prevTr);
                }
            },
            down: function () {
                tr.style.backgroundColor = 'rgba(77, 142, 11, .5)';
                if (!(tr.nextElementSibling === document.querySelector('tr:last-child'))) {
                    const nextTr = tr.nextElementSibling;
                    tBody.insertBefore(nextTr, tr);
                }
            }
        };

        //This would replace the whole conditional statement but the arrow text content doesn't match the property function names
        /*const action = button.textContent;
        nameActions[action]();*/

        if (button.textContent === 'remove') {
            nameActions.remove();
        } else if (button.textContent === 'edit') {
            nameActions.edit();
        } else if (button.textContent === 'save') {
            nameActions.save();
        } else if (button.textContent === '↑') {
            nameActions.up();
        } else if (button.textContent === '↓') {
            nameActions.down();
        }

        //recalulates the case and time totals after click the remove button
        caseTotal();
        totalTime();
    }
    //input value appears blank on click
    if (e.target.tagName === 'INPUT') {
        if (e.target.value === '0') {
            e.target.value = '';
        }
    }

    //remove style on td click
    if (e.target.tagName === 'TD') {
        removeStyle();
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

document.addEventListener('mouseout', function (e) {
    if (e.target.id === 'section') {
        //remove tr style attribute
        removeStyle();
    }
});