localStorage.clear();


let currentSelection = null;

document.getElementById('selectHoliday').addEventListener('click', () => {
    currentSelection = 'holiday';
});

document.getElementById('selectWeekend').addEventListener('click', () => {
    currentSelection = 'weekend';
});

document.getElementById('selectBreakDay').addEventListener('click', () => {
    currentSelection = 'breakday';
});

document.getElementById('selectWeekday').addEventListener('click', () => {
    currentSelection = 'weekday';
});

function generateButtons() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const buttonContainer = document.getElementById('buttonContainer');

    buttonContainer.innerHTML = '';

    if (startDate > endDate) {
        alert('시작 날짜는 끝 날짜보다 이전이어야 합니다.');
        return;
    }

    for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) {
        const button = document.createElement('button');
        button.textContent = dt.toISOString().split('T')[0];
        button.addEventListener('click', function() {
            if (currentSelection === 'holiday') {
                this.classList.add('holiday');
                this.classList.remove('weekend');
                this.classList.remove('breakday')
                this.classList.remove('weekday')
            } else if (currentSelection === 'weekend') {
                this.classList.add('weekend');
                this.classList.remove('holiday');
                this.classList.remove('breakday')
                this.classList.remove('weekday')
            } else if (currentSelection === 'breakday') {
                this.classList.add('breakday');
                this.classList.remove('holiday');
                this.classList.remove('weekend')
                this.classList.remove('weekday')
            } else if (currentSelection === 'weekday') {
                this.classList.add('weekday');
                this.classList.remove('holiday');
                this.classList.remove('weekend')
                this.classList.remove('breakday')
            }
        });
        buttonContainer.appendChild(button);
    }
}

let people = JSON.parse(localStorage.getItem('people')) || [];

let currentPerson = null;

function addPerson() {
    const classLevel = document.getElementById('classLevel').value;
    const rank = document.getElementById('rank').value;
    const name = document.getElementById('name').value;
    const personContainer = document.getElementById('personContainer');

    if (!classLevel || !rank || !name) {
        alert('내용을 입력하세요.');
        return;
    }

    const person = { classLevel, rank, name };
    people.push(person);
    localStorage.setItem('people', JSON.stringify(people));

    const personButton = document.createElement('button');
    personButton.textContent = `짬: ${classLevel}, ${rank} ${name}`;
    personButton.addEventListener('click', function() {
        if (currentPerson === person) {
            currentPerson = null;
            this.style.backgroundColor = '';
        } else {
            currentPerson = person;
            document.querySelectorAll('#personContainer button').forEach(btn => btn.style.backgroundColor = '');
            this.style.backgroundColor = 'darkgrey';
        }
        showPersonSchedule(person);
    });
    personContainer.appendChild(personButton);

    document.getElementById('classLevel').selectedIndex = 0;
    document.getElementById('rank').selectedIndex = 0;
    document.getElementById('name').value = '';
}

function showPersonSchedule(person) {
    const confirmedDatesContainer = document.getElementById('confirmedDatesContainer');
    if (!confirmedDatesContainer) {
        alert('날짜를 먼저 확정해주세요.');
        return;
    }

    const personSchedule = JSON.parse(localStorage.getItem(`schedule_${person.name}`)) || [];

    Array.from(confirmedDatesContainer.children).forEach(element => {
        if (element.tagName === 'DIV' && element.classList.contains('date-container')) {
            const dateStr = element.querySelector('.date-text').textContent;
            const mealButtons = Array.from(element.querySelector('.meal-buttons').children);
            mealButtons.forEach(button => {
                if (personSchedule.includes(`${dateStr}_${button.textContent}`)) {
                    button.style.backgroundColor = 'red';
                } else {
                    button.style.backgroundColor = '';
                }
                button.onclick = () => {
                    if (currentPerson === person) {
                        const scheduleItem = `${dateStr}_${button.textContent}`;
                        if (personSchedule.includes(scheduleItem)) {
                            personSchedule.splice(personSchedule.indexOf(scheduleItem), 1);
                            button.style.backgroundColor = '';
                        } else {
                            personSchedule.push(scheduleItem);
                            button.style.backgroundColor = 'red';
                        }
                        localStorage.setItem(`schedule_${person.name}`, JSON.stringify(personSchedule));
                    }
                };
            });
        }
    });
}

function confirmDates() {
    const buttonContainer = document.getElementById('buttonContainer');
    const confirmedDatesContainer = document.createElement('div');
    confirmedDatesContainer.setAttribute('id', 'confirmedDatesContainer');

    Array.from(buttonContainer.children).forEach((button) => {
        if (button.tagName === 'BUTTON') {
            const dateContainer = document.createElement('div');
            dateContainer.classList.add('date-container');

            const dateText = document.createElement('div');
            dateText.classList.add('date-text');
            dateText.textContent = button.textContent;

            if (button.classList.contains('holiday')) {
                dateText.style.color = 'white';
                dateText.style.backgroundColor = 'red';
            } else if (button.classList.contains('weekend')) {
                dateText.style.color = 'white';
                dateText.style.backgroundColor = 'blue';
            } else if (button.classList.contains('breakday')) {
                dateText.style.color = 'white';
                dateText.style.backgroundColor = 'green';
            } else if (button.classList.contains('weekday')) {
                dateText.style.color = 'white';
                dateText.style.backgroundColor = 'black';
            }

            dateContainer.appendChild(dateText);

            const mealButtonContainer = document.createElement('div');
            mealButtonContainer.classList.add('meal-buttons');

            ['조식', '중식', '석식'].forEach(meal => {
                const mealButton = document.createElement('button');
                mealButton.textContent = meal;
                mealButtonContainer.appendChild(mealButton);
            });

            dateContainer.appendChild(mealButtonContainer);
            confirmedDatesContainer.appendChild(dateContainer);
        }
    });

    document.body.replaceChild(confirmedDatesContainer, buttonContainer);

    people.forEach(person => {
        const personButton = document.createElement('button');
        personButton.textContent = `짬: ${person.classLevel}, ${person.rank} ${person.name}`;
        personButton.addEventListener('click', () => {
            if (currentPerson === person) {
                currentPerson = null;
                personButton.style.backgroundColor = '';
            } else {
                currentPerson = person;
                document.querySelectorAll('#personContainer button').forEach(btn => btn.style.backgroundColor = '');
                personButton.style.backgroundColor = 'darkgrey';
            }
            showPersonSchedule(person);
        });
        document.body.appendChild(personButton);
    });
}