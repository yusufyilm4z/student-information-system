document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const studentDetailsContainer = document.getElementById('studentDetails');
  const lectureResults = document.getElementById('lectureResults');
  const searchButton = document.getElementById('view-course-form-button');
  const courseNameDropdown = document.getElementById('course-name');

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

    // Fetch student data from students.json (replace with your actual path)
    fetch('../json/students.json')
      .then(response => response.json())
      .then(students => {
        // Find students taking the entered course
        const matchingStudents = students.filter(student =>
          student.lectures.some(lecture => lecture.name === courseName)
        );

        if (matchingStudents.length > 0) {
          // Display student details, midterm scores, final scores, and letter grades for the selected course
          displayStudentList(matchingStudents, courseName);
        } else {
          // Display a message if no students found for the entered course
          studentDetailsContainer.innerHTML = '<p id="student-not-found-message">0 students found for selected course.</p>';
          lectureResults.innerHTML = '';
        }
      })
      .catch(error => console.error('Error loading JSON data:', error));
  }

  // Function to display student details, midterm scores, final scores, and letter grades
  function displayStudentList(studentList, courseName) {
    // Clear previous results
    studentDetailsContainer.innerHTML = '';
    lectureResults.innerHTML = '';

    // Create a table element
    const table = document.createElement('table');
    table.classList.add('student-table');

    // Create table headers
    const headerRow = table.createTHead().insertRow();
    const headers = ['Student ID', 'Name', 'Midterm Score', 'Final Score', 'Letter Grade'];
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

      // Fill cells with student data
      studentIdCell.textContent = student.studentID;
      nameCell.textContent = `${student.name} ${student.surname}`;

      // Display the midterm and final scores for the selected course
      const selectedLecture = student.lectures.find(lecture => lecture.name === courseName);
      if (selectedLecture) {
        midtermScoreCell.textContent = selectedLecture.midtermScore;
        finalScoreCell.textContent = selectedLecture.finalScore;

        // Calculate average grade and assign letter grade
        const averageGrade = 0.4 * selectedLecture.midtermScore + 0.6 * selectedLecture.finalScore;
        const pointScale = document.getElementById('point-scale-dropdown').value; // Get selected point scale
        const letterGrade = calculateLetterGrade(averageGrade, pointScale);
        letterGradeCell.textContent = letterGrade;
      } else {
        midtermScoreCell.textContent = 'N/A';
        finalScoreCell.textContent = 'N/A';
        letterGradeCell.textContent = 'N/A';
      }
    });

    // Append the table to the container
    studentDetailsContainer.appendChild(table);
  }

  // Function to calculate letter grade based on the point scale
  function calculateLetterGrade(averageGrade, pointScale) {
    if (pointScale === "7") {
      return assignLetterGrade7Scale(averageGrade);
    } else if (pointScale === "10") {
      return assignLetterGrade10Scale(averageGrade);
    }
  }

  // Function to assign letter grade in a 7-point scale
  function assignLetterGrade7Scale(averageGrade) {
    if (averageGrade >= 93) {
      return 'A';
    } else if (averageGrade >= 85) {
      return 'B';
    } else if (averageGrade >= 77) {
      return 'C';
    } else if (averageGrade >= 70) {
      return 'D';
    } else {
      return 'F';
    }
  }

  // Function to assign letter grade in a 10-point scale
  function assignLetterGrade10Scale(averageGrade) {
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
