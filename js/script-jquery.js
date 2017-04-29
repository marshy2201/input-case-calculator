const $form = $('form');
const $input = $('form input');
const $tBody = $('tBody');
const $span = $('#totalCases span');

//minutes put into hours and minutes
function hoursAndMins($spanElement, $selector) {
    const mins = ($spanElement / 35) * 60;
    const hours = Math.floor(mins / 60);
    const minsLeft = mins % 60;
    $selector.html(hours.toFixed(0) + ' hour(s) <br/>' + minsLeft.toFixed(0) + ' min(s)');
}

//case total calc
function caseTotal() {
    let $total = 0;
    $('td input').each(function () {
        $total += parseInt($(this).val());  
    });
    $span.html($total);
}

//each aisle time required calc
function timeRequired(e) {
    const $span = $(e.target).parent().next().children('span');
    hoursAndMins($(e.target).val(), $span);
}

//total time required calc
function totalTime() {
    const $span2 = $('#totalTime span');
    hoursAndMins($span.html(), $span2);
}

//create rows with elements
function createRow() {
    const $tr = $('<tr></tr>');
    $tr.append('<td><span>' + $input.val() +'</span></td>');
    $tr.append('<td><input type="number" value="0"></td>');
    $tr.append('<td><span></span></td>');

    const $div = $('<div></div>');
    $div.append('<div><button>edit</button><button>remove</button></div>');
    $div.append('<div><button>&uarr;</button><button>&darr;</button</div>');
    $tr.append($div);

    return $tr;
}

//remove background color
function removeBackground() {
    $('tr').each(function () {
        $('tr').css('background-color', '');
    });
}

//add table row with elements
$form.on('submit', function (e) {
    e.preventDefault();
    if ($input.val() != '') {
        const tr = createRow();
        $('tr:first-child').after(tr);
        $input.attr('placeholder', 'Input here...');
        $input.val('');
    } else {
        $input.attr('placeholder', 'Please enter an aisle');
    }
});

//click events
$tBody.on('click', function (e) {
    //remove and edit rows
    if ($(e.target).is('button')) {
        const $button = $(e.target);
        const $tr = $button.closest('tr');
        const $td = $tr.children('td:first-child');
        const $allTd = $tr.children();

        //remove background color
        removeBackground();

        //create element and append
        function createAndAppend($elementType, $value, $buttonName, $elementType2) {
            const $element = $($elementType).val($value);
            $td.append($element)
            $button.text($buttonName);
            $td.children($elementType2).remove();
        }

        const nameActions = {
            remove: function () {
                $allTd.animate({
                    opacity: 0,
                    height: 0,
                    padding: 0,
                    fontSize: 0,
                    backgroundColor: 'red'
                }, 800, function () {
                    $tr.remove();

                    //recalculate after remove button
                    caseTotal();
                    totalTime();
                });   
            },
            edit: function () {
                const $spanText = $td.children('span').text();
                createAndAppend('<input type="text">', $spanText, 'save', 'span');
            },
            save: function () {
                const $inputValue = $('td:first-child input').val();
                createAndAppend('<span>' + $inputValue + '<span>', undefined, 'edit', 'input');
            },
            up: function () {
                $tr.css('background-color', 'rgba(77, 142, 11, .5)');
                const $moveUp = $tr.prev('tr:not("tr:first-child")');
                $moveUp.before($tr);
            },
            down: function () {
                $tr.css('background-color', 'rgba(77, 142, 11, .5)')
                const $moveDown = $tr.next('tr:not("tr:last-child")');
                $moveDown.after($tr);
            }
        };

        if ($button.text() === 'remove') {
            nameActions.remove();
        } else if ($button.text() === 'edit') {
            nameActions.edit();
        } else if ($button.text() === 'save') {
            nameActions.save();
        } else if ($button.text() === '↑') {
            nameActions.up();
        } else if ($button.text() === '↓') {
            nameActions.down();
        }
    }

    //input appears blank on click
    if($(e.target).val() === '0') {
        $(e.target).val('');
    }

    //remove style on td click
    if ($(e.target).is('td')) {
        removeBackground();
    }
});

//calculate input values
$tBody.on('keyup', function (e) {
    if ($(e.target).is('td input')) {
        caseTotal();
        timeRequired(e);
        totalTime();
    }
});

//remove background color
$('body').on('mouseout', function (e) {
    if ($(e.target).is('section')) {
        removeBackground();
    }
});