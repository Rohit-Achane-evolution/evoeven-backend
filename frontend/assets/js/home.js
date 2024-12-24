const newEventForm = document.getElementById('newEventForm');
const btnListView = document.getElementById('btnListView');
const btnCardView = document.getElementById('btnCardView');
const listView = document.getElementById('listView');
const cardView = document.getElementById('cardView');
const emptyState = document.getElementById('emptyState');
const openFilterModalButton = document.getElementById('btnFilter');
const closeModalButton = document.getElementById('closeModal');
const filterModal = document.getElementById('filterModal');
const overlay = document.getElementById('overlay');
const resetButton = document.getElementById('btnReset');
const applyButton = document.getElementById('btnApplyFilter');
const categoryOptions = document.querySelectorAll('.category-option');
const imageUploadArea = document.getElementById('imageUploadArea');
const eventImage = document.getElementById('eventImage');
const deleteEventForm = document.getElementById('deleteEventForm');






let events = [];
let eventToDelete = null;
document.addEventListener('DOMContentLoaded', function () {
    const pagination = document.getElementById('pagination');

    pagination.addEventListener('click', function (e) {
        if (e.target.classList.contains('page-link')) {
            e.preventDefault();

            // Remove active class from current active item
            const currentActive = pagination.querySelector('.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // Add active class to clicked item if it's a number
            const pageItem = e.target.parentElement;
            if (!e.target.hasAttribute('aria-label')) {
                pageItem.classList.add('active');
            }
        }
    });
});


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate(); // Get day (1-31)
    const month = date.toLocaleString('default', { month: 'long' }); // Get full month name
    const year = date.getFullYear(); // Get year (e.g., 2024)
    return `${day}-${month}-${year}`;
}

async function fetchEvents(page = 1) {
    try {
        const limit = 12; // Set your default limit here
        const response = await fetch(`http://localhost:5000/event?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const apievents = await response.json();
        events = Array.isArray(apievents.data) ? apievents.data : [];
        populateViews();
        updatePagination(apievents.currentPage, apievents.totalPages);

    } catch (error) {
        console.error('Error fetching events:', error);
        showError('Failed to load events. Please try again later.');
    }
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger';
    errorElement.textContent = message;
    document.body.insertBefore(errorElement, document.body.firstChild);
}

function showListView() {
    listView.classList.remove('d-none');
    cardView.classList.add('d-none');
    btnListView.classList.add('active');
    btnCardView.classList.remove('active');
}

function showCardView() {
    cardView.classList.remove('d-none');
    listView.classList.add('d-none');
    btnCardView.classList.add('active');
    btnListView.classList.remove('active');
}

btnListView.addEventListener('click', showListView);
btnCardView.addEventListener('click', showCardView);

// Populate views with events
function populateViews() {
    //Check if there are events
    if (events.length === 0) {
        emptyState.classList.remove('d-none');
        listView.classList.add('d-none');
        cardView.classList.add('d-none');
        return;
    }
    // Populate list view
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = events.map(event => `
                    <tr class="rounded-2">
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <img src="${event.images}" class="event-image rounded">
                                <span text-truncate>${event.name}</span>
                            </div>
                        </td>
                        <td>${formatDate(event.date)}</td>
                        <td><span class="event-type-badge">${event.category}</span></td>
                        <td>
                            <button class=" btn btn-sm btn-light  flex-grow-1 flex-md-grow-0" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setEventToDelete('${event.id}')"><i class="bi bi-trash""></i></button>
                            <button class="btn btn-sm btn-light flex-grow-1 flex-md-grow-0" data-bs-toggle="modal" data-bs-target="#newEventModal" "><i class="bi bi-pencil"></i></button>
                        </td>
                    </tr>
                `).join('');

    // Populate card view
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = events.map(event => `
                    <div class="col-md-6 col-lg-4">
                        <div class="card event-card">
                            <img src="${event.images}" class=" event-image card-img-top">
                            <div class="card-body">
                                <div class="d-flex w-100 justify-content-between align-items-start">
                                    <div class="flex-grow-1 overflow-hidden">
                                        <h5 class="card-title text-truncate">${event.name}</h5>
                                        <span class="event-type-badge">${event.category}</span>
                                    </div>
                                    <div class="d-flex flex-shrink-1">
                                        <button class=" btn btn-sm btn-light  flex-grow-1 flex-md-grow-0" data-bs-toggle="modal" data-bs-target="#deleteModal" onclick="setEventToDelete('${event.id}') "><i class="bi bi-trash""></i></button>
                                    <button class="btn btn-sm btn-light flex-grow-1 flex-md-grow-0" data-bs-toggle="modal" data-bs-target="#newEventModal" data-image="${event.images}" data-event-id="${event.id}" data-event-title="${event.name}" data-date="${event.date}" data-event-description="${event.category}"> <i class="bi bi-pencil"></i></button>
                                    </div>
                                </div>
                                <p class="card-text mt-2 text-muted">${formatDate(event.date)}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    const newEventModal = document.getElementById('newEventModal');

    newEventModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget; // Button that triggered the modal
        const eventId = button.getAttribute('data-event-id');

        if (!eventId) {
            // It's for adding a new event, so reset the form fields
            document.getElementById('eventName').value = '';
            document.getElementById('eventDate').value = '';
            document.getElementById('eventCategory').value = '';
            document.getElementById('uploadedImagePreview').classList.add('d-none');
            document.getElementById('uploadedImagePreview').src = '';
            document.querySelector('.modal-title').textContent = 'New Event'; // Update modal title
        } else {
            // It’s for updating, populate the form as before
            const eventDateUpdate = button.getAttribute('data-date');
            const name = button.getAttribute('data-event-title');
            const category = button.getAttribute('data-event-description');
            const eventImage = button.getAttribute('data-image'); // Image URL or base64 data

            // Format the date for the date input
            const formattedDate = formatDateForDateInput(eventDateUpdate);
            console.log(eventId, name, category, formattedDate, eventImage);

            // Get modal input elements
            const eventNameTitle = document.getElementById('eventName');
            const modalTitle = document.querySelector('.modal-title');
            const eventDate = document.getElementById('eventDate');
            const eventCategory = document.getElementById('eventCategory');
            const imagePreview = document.getElementById('uploadedImagePreview');

            // Populate the modal inputs
            eventNameTitle.value = name || "";
            eventDate.value = formattedDate || ""; // Use the formatted date in YYYY-MM-DD format
            modalTitle.textContent = "Update Event";        // Set the selected value for eventCategory
            if (Array.from(eventCategory.options).some(option => option.value === category)) {
                eventCategory.value = category;
            } else {
                eventCategory.value = "";
            }

            // Show and set the image if provided
            if (eventImage) {
                imagePreview.src = eventImage;
                imagePreview.classList.remove('d-none'); // Make the image visible
            } else {
                imagePreview.src = "";
                imagePreview.classList.add('d-none'); // Hide the image if not provided
            }
        }
    });
});


// Helper function to format the date for the <input type="date">
function formatDateForDateInput(inputDate) {
    const date = new Date(inputDate);

    // Extract year, month, and day in the format YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}




// Function to update pagination dynamically
function updatePagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    // Previous button
    const prevClass = currentPage === 1 ? 'disabled' : '';
    pagination.innerHTML += `
            <li class="page-item ${prevClass}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
            </li>
        `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        pagination.innerHTML += `
                <li class="page-item ${activeClass}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
    }

    // Next button
    const nextClass = currentPage === totalPages ? 'disabled' : '';
    pagination.innerHTML += `
            <li class="page-item ${nextClass}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
            </li>
        `;

    // Add event listeners to pagination links
    document.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page, 10);
            if (!isNaN(page)) {
                fetchEvents(page);
            }
        });
    });
}

// Image upload handling
imageUploadArea.addEventListener('click', () => eventImage.click());

imageUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    imageUploadArea.style.borderColor = '#ff5722';
});

imageUploadArea.addEventListener('dragleave', () => {
    imageUploadArea.style.borderColor = '#ddd';
});

imageUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    imageUploadArea.style.borderColor = '#ddd';
    if (e.dataTransfer.files[0]) {
        eventImage.files = e.dataTransfer.files; // Assign file to hidden input
        handleImage(e.dataTransfer.files[0]);
    }
});

eventImage.addEventListener('change', (e) => {
    if (e.target.files[0]) {
        handleImage(e.target.files[0]);
    }
});

function handleImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        console.log(e.target.result);
        imageUploadArea.innerHTML = `
                        <img src="${e.target.result}" style="max-width: 100%; max-height: 200px;">
                        <p class="mb-0 mt-2">Click to change image</p>
                    `;
    };
    reader.readAsDataURL(file);
    console.log(file);
}

// Form submission new event add
newEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append('name', document.querySelector('input[name="eventName"]').value);
    const dateInputValue = document.querySelector('input[name="eventDate"]').value; // Get the string from the input
    const eventDate = new Date(dateInputValue); // Convert string to a Date object
    formData.append('date', eventDate.toISOString());
    formData.append('category', document.querySelector('select[name="eventCategory"]').value);

    // Get the image file from the hidden input
    const imageFile = eventImage.files[0];
    if (imageFile) {
        formData.append('images', imageFile); // Append the file
    } else {
        alert('Please upload an image');
        return;
    }
    console.log('New Event:', { imageFile });
    try {
        const response = await fetch('http://localhost:5000/event', {
            method: 'POST',
            body: formData, // Send FormData directly
        });

        if (!response.ok) {
            throw new Error('Failed to create event');
        }

        // Close modal and refresh UI
        bootstrap.Modal.getInstance(document.getElementById('newEventModal')).hide();
    } catch (error) {
        console.error('Error creating event:', error);
    }
});


//get id to delete event
function setEventToDelete(eventId) {
    eventToDelete = eventId;
}
//Form submission delete  event
deleteEventForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Make API call to delete the event
    if (eventToDelete) {
        try {   
            const response = await fetch(`http://localhost:5000/event/${eventToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }

            // Remove the event from the events array
            events = events.filter(event => event.id !== eventToDelete);

            // Update the views after deletion
            populateViews();

            // Close the modal
            bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        } catch (error) {
            console.error('Error deleting event:', error);
            showError('Failed to delete the event. Please try again later.');
        }
    }
});




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



// Initialize the view
// populateViews();
fetchEvents();