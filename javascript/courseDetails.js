document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const studentDetailsContainer = document.getElementById('studentDetails');
  const lectureResults = document.getElementById('lectureResults');
  const showGradesButton = document.getElementById('view-course-form-button');
  const courseNameDropdown = document.getElementById('course-name');

  // Fetch lectures from lectures.json and populate the dropdown menu
  fetch('../json/lectures.json')
    .then(response => response.json())
    .then(lectures => {
      // Populate course name dropdown with options from lectures.json
      lectures.forEach(lecture => {
        const option = document.createElement('option');
        option.value = lecture.lectureName;
        option.textContent = lecture.lectureName;
        courseNameDropdown.appendChild(option);
      });
    })

  // Attach the function to the button click event
  if (showGradesButton) {
    showGradesButton.addEventListener('click', showCourseDetails);
  }

  // Function to show course details
  function showCourseDetails() {
    const courseName = courseNameDropdown.value.trim();

    // Fetch student data from students.json (replace with your actual path)
    fetch('../json/students.json')
      .then(response => response.json())
      .then(students => {
        // Find students taking the entered course
        const matchingStudents = students.filter(student =>
          student.lectures.some(lecture => lecture.name === courseName)
        );

        if (matchingStudents.length > 0) {
          // Display course details
          displayCourseDetails(matchingStudents);
        } else {
          // Display a message if no students found for the entered course
          studentDetailsContainer.innerHTML = '<p>No students found for the entered course.</p>';
          lectureResults.innerHTML = '';
        }
      })
      .catch(error => console.error('Error loading JSON data:', error));
  }

  // Function to display course details
  function displayCourseDetails(studentList) {
    // Clear previous results
    studentDetailsContainer.innerHTML = '';
    lectureResults.innerHTML = '';

    // Filter students based on passed or failed status
    const passedStudents = studentList.filter(student => hasPassed(student));
    const failedStudents = studentList.filter(student => !hasPassed(student));

    // Calculate the mean score of the entire class
    const meanScore = calculateMeanScore(studentList);

    // Display course details in a table
    const table = document.createElement('table');
    table.classList.add('course-details-table');

    // Create table headers
    const headerRow = table.createTHead().insertRow();
    const headers = ['#', 'Value'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Create table body
    const body = table.createTBody();

    // Display number of passed students
    const passedRow = body.insertRow();
    insertTableCells(passedRow, ['Number of Passed Students', passedStudents.length]);

    // Display number of failed students
    const failedRow = body.insertRow();
    insertTableCells(failedRow, ['Number of Failed Students', failedStudents.length]);

    // Display mean score of the entire class
    const meanScoreRow = body.insertRow();
    insertTableCells(meanScoreRow, ['Mean Score of the Entire Class', meanScore.toFixed(2)]);

    // Append the table to the container
    lectureResults.appendChild(table);
  }

  // Function to check if a student has passed
  function hasPassed(student) {
    const totalScore = student.lectures.reduce((acc, lecture) => acc + lecture.midtermScore + lecture.finalScore, 0);
    const averageScore = totalScore / (student.lectures.length * 2);

    // Determine if the student has passed based on a simple average
    return averageScore >= 60;
  }

  // Function to calculate the mean score
  function calculateMeanScore(studentList) {
    const totalScore = studentList.reduce((acc, student) =>
      acc + student.lectures.reduce((lectureAcc, lecture) => lectureAcc + lecture.midtermScore + lecture.finalScore, 0)
    , 0);

    const totalSubjects = studentList.reduce((acc, student) => acc + student.lectures.length * 2, 0);

    return totalScore / totalSubjects;
  }

  // Function to insert table cells
  function insertTableCells(row, data) {
    data.forEach((value, index) => {
      const cell = row.insertCell(index);
      cell.textContent = value;
    });
  }
});
