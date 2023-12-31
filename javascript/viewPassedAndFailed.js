document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const studentDetailsContainer = document.getElementById('studentDetails');
  const lectureResults = document.getElementById('lectureResults');
  const searchButton = document.getElementById('view-pf-form-button');
  const courseNameDropdown = document.getElementById('course-name');
  const passFailDropdown = document.getElementById('pass-fail-dropdown');

  // Attach the search function to the button click event
  if (searchButton) {
    searchButton.addEventListener('click', searchStudent);
  }

  // Populate course name dropdown with options from lectures.json
  fetch('../json/lectures.json')
    .then(response => response.json())
    .then(lectures => {
      populateCourseDropdown(lectures);
    })

  // Function to populate the course dropdown
  function populateCourseDropdown(lectures) {
    lectures.forEach(lecture => {
      const option = document.createElement('option');
      option.value = lecture.lectureName;
      option.textContent = lecture.lectureName;
      courseNameDropdown.appendChild(option);
    });
  }

  // Function to handle the search for students
  function searchStudent(event) {
    event.preventDefault();

    const courseName = courseNameDropdown.value.trim();
    const passFailStatus = passFailDropdown.value.trim();

    // Fetch student data from students.json (replace with your actual path)
    fetch('../json/students.json')
      .then(response => response.json())
      .then(students => {
        // Find students taking the entered course
        const matchingStudents = students.filter(student =>
          student.lectures.some(lecture => lecture.name === courseName)
        );

        // Filter students based on passed or failed status
        const filteredStudents = passFailStatus === 'Passed'
          ? matchingStudents.filter(student => hasPassed(student, courseName))
          : matchingStudents.filter(student => !hasPassed(student, courseName));

        if (filteredStudents.length > 0) {
          // Display student details, midterm scores, final scores, letter grades, and pass/fail status for the selected course
          displayStudentList(filteredStudents, courseName);
        } else {
          // Display a message if no students found for the entered criteria
          studentDetailsContainer.innerHTML = `<p>No ${passFailStatus} students found for the entered course.</p>`;
          lectureResults.innerHTML = '';
        }
      })
      .catch(error => console.error('Error loading JSON data:', error));
  }

  // Function to check if a student has passed based on a simple average
  function hasPassed(student, courseName) {
    const selectedLecture = student.lectures.find(lecture => lecture.name === courseName);
    if (selectedLecture) {
      const averageGrade = (selectedLecture.midtermScore + selectedLecture.finalScore) / 2;
      return averageGrade >= 60;
    }
    return false;
  }

  // Function to display student details, midterm scores, final scores, letter grades, and pass/fail status
  function displayStudentList(studentList, courseName) {
    // Clear previous results
    studentDetailsContainer.innerHTML = '';
    lectureResults.innerHTML = '';

    // Create a table element
    const table = document.createElement('table');
    table.classList.add('student-table');

    // Create table headers
    const headerRow = table.createTHead().insertRow();
    const headers = ['Student ID', 'Name', 'Midterm Score', 'Final Score', 'Letter Grade', 'Pass/Fail'];
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    // Create table body
    const body = table.createTBody();

    // Display each student in a table row
    studentList.forEach(student => {
      const row = body.insertRow();
      const studentIdCell = row.insertCell(0);
      const nameCell = row.insertCell(1);
      const midtermScoreCell = row.insertCell(2);
      const finalScoreCell = row.insertCell(3);
      const letterGradeCell = row.insertCell(4);
      const passFailCell = row.insertCell(5);

      // Fill cells with student data
      studentIdCell.textContent = student.studentID;
      nameCell.textContent = `${student.name} ${student.surname}`;

      // Display the midterm and final scores for the selected course
      const selectedLecture = student.lectures.find(lecture => lecture.name === courseName);
      if (selectedLecture) {
        midtermScoreCell.textContent = selectedLecture.midtermScore;
        finalScoreCell.textContent = selectedLecture.finalScore;

        // Calculate average grade and assign letter grade
        const averageGrade = (selectedLecture.midtermScore + selectedLecture.finalScore) / 2;
        const letterGrade = calculateLetterGrade(averageGrade);
        letterGradeCell.textContent = letterGrade;

        // Determine pass/fail status
        const passFailStatus = hasPassed(student, courseName) ? 'PASSED' : 'FAILED';
        passFailCell.textContent = passFailStatus;
      } else {
        midtermScoreCell.textContent = 'N/A';
        finalScoreCell.textContent = 'N/A';
        letterGradeCell.textContent = 'N/A';
        passFailCell.textContent = 'N/A';
      }
    });

    // Append the table to the container
    studentDetailsContainer.appendChild(table);
  }

  // Function to calculate letter grade based on average grade
  function calculateLetterGrade(averageGrade) {
    if (averageGrade >= 90) {
      return 'A';
    } else if (averageGrade >= 80) {
      return 'B';
    } else if (averageGrade >= 70) {
      return 'C';
    } else if (averageGrade >= 60) {
      return 'D';
    } else {
      return 'F';
    }
  }
});