// Function to retrieve a form input value by its ID
function getInputValueById(inputId) {
  return document.getElementById(inputId).value;
}
// Function to display an alert for empty fields
function alertForEmptyFields() {
  alert("Please fill in all the required fields.");
}
// Function to create a new course object
function createNewCourse(courseName, pointScale) {
  return {
    "lectureName": courseName,
    "pointScale": parseInt(pointScale)
  };
}
// Function to save course data to local storage
function saveCourseToLocalStorage(newCourse) {
  const newCourseJSON = JSON.stringify(newCourse);
  localStorage.setItem("newCourse", newCourseJSON);
}
// Function to retrieve and parse course data from local storage
function getStoredCourse() {
  const storedCourseJSON = localStorage.getItem("newCourse");
  return JSON.parse(storedCourseJSON);
}
// Function to log parsed data to the console
function logParsedData(parsedData) {
  console.log(parsedData);
}
// Function to handle the "Add to Catalog" button click
function addToCatalog(event) {
  const courseName = getInputValueById("course-name");
  const pointScale = getInputValueById("point-scale-dropdown");
  
  event.preventDefault();

  if (!courseName || !pointScale) {
    alertForEmptyFields();
    return;
  }

  const newCourse = createNewCourse(courseName, pointScale);
  saveCourseToLocalStorage(newCourse);
  const storedCourse = getStoredCourse();
  logParsedData(storedCourse);
  alert('Course added to the catalog!');
}

// Get the "Add to Catalog" button element
const addToCatalogButton = document.getElementById("course-add-form-button");

// Add an event listener to the button to trigger the addToCatalog function on click
addToCatalogButton.addEventListener("click", addToCatalog);
