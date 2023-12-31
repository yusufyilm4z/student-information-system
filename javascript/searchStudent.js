document.addEventListener('DOMContentLoaded', function () {
  // DOM elements
  const studentDetailsContainer = document.getElementById('studentDetails');
  const lectureResults = document.getElementById('lectureResults');

  // Function to search for a student
  function searchStudent(event) {
    // Get the search input value
    const searchInput = document.getElementById('search-student-input').value;
    event.preventDefault();

    // Fetch student data from students.json (replace with your actual path)
    fetch('../json/students.json')
      .then(response => response.json())
      .then(data => {
        // Find the student with the entered studentID
        const student = data.find(student => student.studentID === searchInput);
        if (student) {
          // Display student details
          studentDetailsContainer.innerHTML = `
          <div class="student-info-container">
            <p><strong>Student ID</strong>: ${student.studentID}</p>
            <p><strong>Name</strong>: ${student.name} ${student.surname}</p>
          </div>
          `;
          // Display the student's lectures
          displayLectures(student.lectures);
        } else {
          // Display a message if the student is not found
          studentDetailsContainer.innerHTML = '<p>Student not found.</p>';
        }
      })
  }

  // Function to display lectures
  function displayLectures(lectures) {
    // Clear previous results
    lectureResults.innerHTML = '';

    // Create a table element
    const table = document.createElement('table');
    const pointScale = document.getElementById('point-scale-dropdown').value; // Get selected point scale
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

    // Display each lecture as a table row
    lectures.forEach(lecture => {
      const row = body.insertRow();
      const lectureNameCell = row.insertCell(0);
      const midtermScoreCell = row.insertCell(1);
      const finalScoreCell = row.insertCell(2);
      const letterGradeCell = row.insertCell(3);

      // Calculate weighted grade (40% midterm + 60% final)
      const averageGrade = 0.4 * lecture.midtermScore + 0.6 * lecture.finalScore;
      
      // Assign letter grade based on the selected point scale
      let letterGrade;
      if (pointScale === "7") {
        letterGrade = getLetterGrade7Scale(averageGrade);
      } else if (pointScale === "10") {
        letterGrade = getLetterGrade10Scale(averageGrade);
      } else {
        // Display a message if no point scale is chosen
        lectureResults.innerHTML = '<p>Please choose point scale.</p>';
        return;
      }

      // Fill cells with lecture data and grades
      lectureNameCell.textContent = lecture.name;
      midtermScoreCell.textContent = lecture.midtermScore;
      finalScoreCell.textContent = lecture.finalScore;
      letterGradeCell.textContent = letterGrade;

      lectureResults.appendChild(table);
    });
  }

  // Function to get letter grade in a 7-point scale
  function getLetterGrade7Scale(averageGrade) {
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

  // Function to get letter grade in a 10-point scale
  function getLetterGrade10Scale(averageGrade) {
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

  // Attach the search function to the button click event
  const searchButton = document.querySelector('.form-button');
  if (searchButton) {
    searchButton.addEventListener('click', searchStudent);
  }
});
