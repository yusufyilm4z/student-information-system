document.addEventListener('DOMContentLoaded', function () {
  // Select the dropdown element
  const dropdownSelect = document.querySelector('.dropdown-select');

  // Fetch lecture data from lectures.json to display them in dropdown menu.
  fetch('../json/lectures.json')
    .then(response => response.json())
    .then(lectures => {
      // Populate the dropdown with lecture names
      lectures.forEach(lecture => {
        const option = document.createElement('option');
        option.value = lecture.lectureName;
        option.textContent = lecture.lectureName;
        dropdownSelect.appendChild(option);
      });
    });

  // Function to add a new student to the list
  function addToStudentList(event) {
    // Retrieve input values
    const lectureName = document.getElementById("lectureSelect").value;
    const studentID = document.getElementById("student-id").value;
    const studentName = document.getElementById("student-name").value;
    const studentSurname = document.getElementById("student-surname").value;
    const midtermScore = document.getElementById("student-midterm").value;
    const finalScore = document.getElementById("student-final").value;

    // Prevent form submission
    event.preventDefault();

    // Check if any field is empty
    if (!lectureName || !studentID || !studentName || !studentSurname || !midtermScore || !finalScore) {
      alert("Please fill all fields.");
      return;
    }

    // Create a new student object
    const newStudent = {
      "studentID": studentID,
      "name": studentName,
      "surname": studentSurname,
      "lectures": [
        {
          "name": lectureName,
          "midtermScore": parseInt(midtermScore),
          "finalScore": parseInt(finalScore)
        }
      ]
    };

    // Convert the array back to JSON
    const updatedData = JSON.stringify(newStudent);

    // Save the updated JSON data to local storage
    localStorage.setItem("newStudent", updatedData);

    // Retrieve and log the updated data from local storage
    let updatedDataDeserialized = JSON.parse(localStorage.getItem("newStudent"));
    console.log(updatedDataDeserialized);

    // Display success message
    alert('Student added to student list');
  }

  // Add click event listener to the "Add Student" button
  const addToStudentListButton = document.getElementById("add-student-form-button");
  addToStudentListButton.addEventListener("click", addToStudentList);
});
