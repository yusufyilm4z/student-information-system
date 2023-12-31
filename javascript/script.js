// Function to handle dropdown interaction
function toggleDropdown() {
  // Extract the dropdown ID from the button's ID
  var dropdownId = this.id.replace('sidebar-dropdown-', '');

  // Find the associated dropdown menu and icon based on the extracted ID
  var dropdownMenu = document.querySelector('.menu-' + dropdownId);
  var dropdownIcon = document.querySelector('.icon-' + dropdownId);

  // Toggle the 'hidden' class to show/hide the dropdown menu and rotate the icon
  dropdownMenu.classList.toggle('hidden');
  dropdownIcon.classList.toggle('rotate');
}

// Get all elements with the class 'sidebar-item-dropdown-button'
var dropdownButtons = document.querySelectorAll('.sidebar-item-dropdown-button');

// Attach click event listener to every button to toggle dropdown
dropdownButtons.forEach(function (button) {
  button.addEventListener('click', toggleDropdown);
});