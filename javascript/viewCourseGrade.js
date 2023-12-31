document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const studentDetailsContainer = document.getElementById('studentDetails');
  const lectureResults = document.getElementById('lectureResults');
  const searchButton = document.querySelector('.form-button');
  const courseDropdown = document.getElementById('course-name');

    // Use Promise.all to fetch data from multiple sources concurrently
  Promise.all([
    // Fetch student data from students.json
    fetch('../json/students.json').then(response => response.json()),
    // Fetch course data from lectures.json
    fetch('../json/lectures.json').then(response => response.json())
  ]).then(([students, courses]) => {
    // Once both promises are fulfilled, the callback function is executed with an array of results.
    // Populate the course dropdown with the fetched course data
      populateCourseDropdown(courses);

    // Attach the search function to the form submission event
    if (searchButton) {
      searchButton.addEventListener('click', searchStudent);
    }

    // Function to populate the course dropdown
    function populateCourseDropdown(courses) {
      courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.lectureName;
        option.textContent = course.lectureName;
        courseDropdown.appendChild(option);
      });
    }

    // Function to handle the search for a student
    function searchStudent(event) {
      event.preventDefault();

      // Get input values
      const studentID = document.getElementById('view-course-input').value.trim();
      const selectedCourse = courseDropdown.value;
      const pointScale = document.getElementById('point-scale-dropdown').value;

      // Find the student with the entered studentID
      const student = students.find(student => student.studentID === studentID);

      if (student) {
        // Display student details and scores for the selected course
        displayStudentScores(student, selectedCourse, pointScale);
      } else {
        // Display a message if the student is not found
        studentDetailsContainer.innerHTML = '<p id="student-not-found-message">There is no student with that student id.</p>';
        lectureResults.innerHTML = '';
      }
    }

    // Function to display student scores
    function displayStudentScores(student, selectedCourse, pointScale) {
      // Clear previous results
      studentDetailsContainer.innerHTML = '';
      lectureResults.innerHTML = '';

      // Display student details
      studentDetailsContainer.innerHTML = `
        <div class="student-info-container">
          <p><strong>Student ID</strong>: ${student.studentID}</p>
          <p><strong>Name</strong>: ${student.name} ${student.surname}</p>
        </div>
      `;

      // Find the selected course for the student
      const selectedLecture = student.lectures.find(lecture => lecture.name === selectedCourse);

      if (selectedLecture) {
        // Create a table element for displaying scores
        const table = document.createElement('table');
        table.classList.add('lecture-table');

        // Create table headers
        const headerRow = table.createTHead().insertRow();
        const headers = ['Lecture Name', 'Midterm Score', 'Final Score', 'Letter Grade'];
        headers.forEach(headerText => {
          const th = document.createElement('th');
          th.classList.add("lecture-table-item");
          th.textContent = headerText;
          headerRow.appendChild(th);
        });

        // Create table body
        const body = table.createTBody();
        const row = body.insertRow();
        const lectureNameCell = row.insertCell(0);
        const midtermScoreCell = row.insertCell(1);
        const finalScoreCell = row.insertCell(2);
        const letterGradeCell = row.insertCell(3);

        // Calculate weighted grade (40% midterm + 60% final)
        const averageGrade = 0.4 * selectedLecture.midtermScore + 0.6 * selectedLecture.finalScore;
        const letterGrade = calculateLetterGrade(averageGrade, pointScale);

        // Fill cells with lecture data and grades
        lectureNameCell.textContent = selectedLecture.name;
        midtermScoreCell.textContent = selectedLecture.midtermScore;
        finalScoreCell.textContent = selectedLecture.finalScore;
        letterGradeCell.textContent = letterGrade;

        // Append the table to the lectureResults container
        lectureResults.appendChild(table);
      } else {
        lectureResults.innerHTML = '<p id="score-not-found-message">No scores found for the selected course.</p>';
      }
    }

    // Function to calculate the letter grade based on the point scale
    function calculateLetterGrade(averageGrade, pointScale) {
      if (pointScale === "7") {
        return calculateLetterGrade7Scale(averageGrade);
      } else if (pointScale === "10") {
        return calculateLetterGrade10Scale(averageGrade);
      }
    }

    // Function to calculate the letter grade in a 7-point scale
    function calculateLetterGrade7Scale(averageGrade) {
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

    // Function to calculate the letter grade in a 10-point scale
    function calculateLetterGrade10Scale(averageGrade) {
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
});