const openFilterModalButton = document.getElementById('btnFilter');
const closeModalButton = document.getElementById('closeModal');
const filterModal = document.getElementById('filterModal');
const overlay = document.getElementById('overlay');
const resetButton = document.getElementById('btnReset');
const applyButton = document.getElementById('btnApplyFilter');
const categoryOptions = document.querySelectorAll('.category-option');

// Open filter modal
openFilterModalButton.addEventListener('click', () => {
    // Get the position of the filter button
    const buttonRect = openFilterModalButton.getBoundingClientRect();
    // Position the filter modal near the button
    filterModal.style.left = `${buttonRect.left}px`; // Align modal to button’s left
    filterModal.style.top = `${buttonRect.bottom}px`; // Place it just below the button
    // Display modal and overlay
    filterModal.style.display = 'block';
    overlay.style.display = 'block';
    // Slide in modal from the left
    setTimeout(() => filterModal.style.transform = 'translateX(0)', 10);
});

// Close filter modal
closeModalButton.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

function closeModal() {
    filterModal.style.transform = 'translateX(-100%)'; // Slide out to the left
    overlay.style.display = 'none';
    setTimeout(() => filterModal.style.display = 'none', 300);
}

// Toggle category selection
categoryOptions.forEach(option => {
    option.addEventListener('click', () => {
        option.classList.toggle('selected');
    });
});

// Reset filters
resetButton.addEventListener('click', () => {
    categoryOptions.forEach(option => {
        option.classList.remove('selected');
    });
});

// Apply filters
applyButton.addEventListener('click', () => {
    const selectedCategories = [];
    categoryOptions.forEach(option => {
        if (option.classList.contains('selected')) {
            selectedCategories.push(option.dataset.category || option.dataset.date);
        }
    });

    // You can now use selectedCategories to filter your content
    console.log('Selected Filters:', selectedCategories);

    // Close modal after applying filters
    closeModal();
});





// const formData = new FormData(newEventForm);

// const eventImage = formData.get('eventImages');
// const eventName = formData.get('eventName');
// const eventDate = formData.get('eventDate');
// const eventCategory = formData.get('eventCategory');

// console.log('Event Image:', eventImage);
// console.log('Event Name:', eventName);
// console.log('Event Date:', eventDate);
// console.log('Event Category:', eventCategory);