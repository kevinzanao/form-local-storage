// bug to resolve: enter key send the object instead of saving

// HTML elements
const $form = document.getElementById('js-form');
const $tbody = document.querySelector('#table tbody');
const $name = document.getElementById('name');
const $birthDate = document.getElementById('birth-date');
const $inputRequiredInstruction = document.querySelectorAll('.input-required');
const $submit = document.getElementById('submit-button');
const $saveButton = document.getElementById('save-button');


// Input patterns
const namePattern = /\D{2,119}([aA-zZ]+([ç]+)?)/;
const birthDatePattern = /\d{2}[/]\d{2}[/]\d{4}/;
const isNumberPattern = /\d/;
let inputNameConfirmation = false;
let birthDateConfirmation = false;  

// Check every change in name input
$name.addEventListener('input', nameRegexValidation)

// Validate input name with regex
function nameRegexValidation() {
  inputNameConfirmation = false;
  $inputRequiredInstruction[0];

  if (!isNumberPattern.test($name.value)) {
    if (namePattern.test($name.value)) {
      inputNameConfirmation = true;
    } else {
      $inputRequiredInstruction[0].innerText = "O nome tem quer ter de 3 a 120 letras";
    }
  } else {
    $inputRequiredInstruction[0].innerText = "O nome não pode possuir nenhum número.";
  }

    releaseToSend();
    releaseToSave();
}

// Check every change in date input
$birthDate.addEventListener('input', (e) => {
  // console.log(e.target.value)
  birthDateValidation(e.target.value);
  // releaseToSend();
})

// Check that date value are correct
function birthDateValidation(date) {
  birthDateConfirmation = false;

  const year = new Date();
  
  let formatedDate = date.split("/");

  const yearLimit = formatedDate[2] <= year.getFullYear() && formatedDate[2] >= 1800;
  const monthLimit = formatedDate[1] <= 12 && formatedDate[1] > 0;
  const dayLimit = formatedDate[0] <= 31 && formatedDate[0] > 0;

  if (dayLimit && monthLimit && yearLimit) {
    if (birthDatePattern.test($birthDate.value)) {
      birthDateConfirmation = true;
    }
  }

  releaseToSend();
  releaseToSave();
}

// show instructions if information in input is wrong
function instructionsSpan() {
  if(inputNameConfirmation) {
    $inputRequiredInstruction[0].style.visibility = "hidden";
  } else {
    $inputRequiredInstruction[0].style.visibility = "visible";
  }
  if (birthDateConfirmation) {
    $inputRequiredInstruction[1].style.visibility = "hidden";
  } else {
    $inputRequiredInstruction[1].style.visibility = "visible";
  }
}

// Release the submit button
function releaseToSend() {
  if (inputNameConfirmation && birthDateConfirmation) {
    $submit.disabled = false;
  } else {
    $submit.disabled = true;
  }

  instructionsSpan();
}

// Release the save button
function releaseToSave() {
  if (inputNameConfirmation && birthDateConfirmation) {
    $saveButton.disabled = false;
  } else {
    $saveButton .disabled = true;
  }

  instructionsSpan();
}

// cancel the submit load
$form.addEventListener("submit", (e) => {
  e.preventDefault();
});

function createTableElements(value) {
  // table elements
  const tr = document.createElement('tr')
  const td_name = document.createElement('td');
  const td_birth = document.createElement('td');
  const td_actions = document.createElement('td');
  const editButton = document.createElement('img');
  const deleteButton = document.createElement('img');

  // Format birth date to BR type
  let birthDateFormated = value.birthDate.split("/");
  birthDateFormated.reverse()

  tr.id = value.id;
  td_name.innerText = value.name;
  td_birth.innerText = birthDateFormated.join("/");
  editButton.src = './assets/edit-icon.svg';
  editButton.alt = 'edit icon';
  editButton.addEventListener('click', editPersonData);
  deleteButton.src = './assets/delete-icon.svg';
  deleteButton.alt = 'delete icon';
  deleteButton.addEventListener('click', deletePersonRegister);

  td_actions.appendChild(editButton);
  td_actions.appendChild(deleteButton);
  tr.appendChild(td_name);
  tr.appendChild(td_birth);
  tr.appendChild(td_actions);
  $tbody.appendChild(tr);
}

// FUNCTIONS GET VALUE

// get person's data and create an array that returns person's Data and index position
function getPersonData() {
  let element = event.target.parentNode;
  let elementId = Number(element.parentNode.id);
  let storedPeoples = JSON.parse(localStorage.getItem("peoples"));
  let findedPerson;

  storedPeoples.forEach((person) => {
    if (elementId === person.id) {

     findedPerson = person;
    }
  })
  
  return [findedPerson, storedPeoples.indexOf(findedPerson)]
}

// Create elements in the table and add the person's data inside of them
function getStoredPeoplesAndShow() {
  let storedPeoples = JSON.parse(localStorage.getItem("peoples"));

  $tbody.innerHTML = "";

  if (storedPeoples) {
    storedPeoples.forEach((person) => {
      createTableElements(person);
    });
  }

  // enterKeyDownSubmit();
} 

// Takes input values and display in the console
function getInputValues() {
  let nameValue = $name.value;
  let birthDateValue = $birthDate.value;
  
  if (nameValue.length > 0 && birthDateValue.length > 0) {
    addToLocalStorage(createPerson(nameValue, birthDateValue));
  }

  getStoredPeoplesAndShow();

  inputNameConfirmation = false;
  birthDateConfirmation = false;
  $name.value = '';
  $birthDate.value = '';
  $submit.disabled = true;
  $name.focus();
}

// Stores last person the editPersonData() got 
let lastPersonDataUsed;

// ACTION FUCTIONS

// Update and save to localStorage
function savePersonDataEdit() {
  const data = lastPersonDataUsed;
  const personData = data[0];
  
  const personIndexArray = data[1];
  let storedPeoples = JSON.parse(localStorage.getItem("peoples"));
  
  personData.name = $name.value;
  personData.birthDate = $birthDate.value;

  storedPeoples[personIndexArray] = personData;
  localStorage.setItem("peoples", JSON.stringify(storedPeoples));


  $name.value = "";
  $birthDate.value = "";
  $saveButton.hidden = true;
  $submit.hidden = false;
  $submit.disabled = true;
  inputNameConfirmation = false;
  birthDateConfirmation = false;

  getStoredPeoplesAndShow()
}

// update the state of elements needed to edit the person's data
function updateHtmlElementsState(person) {
  $name.value = person.name;
  $birthDate.value = person.birthDate;

  nameRegexValidation();
  birthDateValidation(person.birthDate);

  $submit.hidden = true;
  $saveButton.hidden = false;
}

// Passes the data to update the HTML elements and to the function that saves person's edited data
function editPersonData() {
  const data = getPersonData();
  lastPersonDataUsed = data;
  const personData = data[0];

  updateHtmlElementsState(personData);
  // enterKeyDownSave();

  $name.focus();
}

function deletePersonRegister() {
  const data = getPersonData()
  
  let storedPeoples = JSON.parse(localStorage.getItem("peoples"));
  
  storedPeoples.splice(data[1], 1);
  
  localStorage.setItem("peoples", JSON.stringify(storedPeoples));

  getStoredPeoplesAndShow();
}

$submit.onclick = getInputValues;
$saveButton.onclick = savePersonDataEdit;

function enterKeyDownSave() {
  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      console.log("cliquei no enter ")
      savePersonDataEdit();
    }
  })
}

function enterKeyDownSubmit() {
  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      console.log("enter de submit")
      getInputValues();
    }
  })
}

// Creates an array in local storage, and adds the "person" object inside
function addToLocalStorage(person) {
  let storedPeoples = JSON.parse(localStorage.getItem("peoples")) || [];
  // console.log("Não pode ter nada", storedPeoples)

  if (storedPeoples) {
    // console.log("jã tem");
    storedPeoples.push(person);
    // console.log("Pode ter", storedPeoples);
    localStorage.setItem("peoples", JSON.stringify(storedPeoples))
    // console.log("valor do array local atualizado", JSON.parse(localStorage.getItem("peoples")))
  } 
}

// Create a person object with input values
function createPerson(name, birthDate) {
  const storadePeoples = JSON.parse(localStorage.getItem("peoples")) || [];

  let person = {
    id: storadePeoples.length + 1,
    name: name,
    birthDate: birthDate,
  }

  return person;
}

getStoredPeoplesAndShow();