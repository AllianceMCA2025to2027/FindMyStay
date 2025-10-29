//DOM Elements

// Hamburger Menu
const bars = document.querySelector(".fa-bars");
const mobileMenufixed = document.querySelector(".mobile-menu-fixed");
const menu = document.querySelector(".mobile-menu-container");

if(!bars || !mobileMenufixed || !menu){
    //Elements not found , dont run the script
}else{
    function openMenu(){
        mobileMenufixed.classList.add('is-open');
    };

    function closeMenu(){
        mobileMenufixed.classList.remove('is-open');
    };

    function toggleMenu(){
        if(mobileMenufixed.classList.contains('is-open')){
            closeMenu();
        }else{
            openMenu();
        };
    };
    
    //Toggle the menu on click
    bars.addEventListener('click',function(e){
        e.stopPropagation();
        toggleMenu();
    })

    //close when a link inside the menu is clicked
    menu.addEventListener('click', function(e){
        const link = e.target.closest('.mobile-menu-link');
        if(link){
            closeMenu();
        }
    })

    //close when clicked outside of the menu
    document.addEventListener('click',function(e){
        const clickInsideMenu = menu.contains(e.target);
        const clickedBars = bars.contains(e.target);
        if(!clickInsideMenu && !clickedBars){
            closeMenu();
        }
    })
};

// Enhanced Search Bar Functionality

// Store search data
const searchData = {
    city: 'Anywhere',
    checkin: null,
    checkout: null,
    adults: 0,
    children: 0,
    pets: 0
};

// Get all dropdown triggers
const dropdownTriggers = document.querySelectorAll('.search-dropdown-trigger');
const cityDropdown = document.querySelector('.city-dropdown');
const calendarDropdown = document.querySelector('.calendar-dropdown');
const guestDropdown = document.querySelector('.guest-dropdown');

// City Selection
const cityList = document.querySelectorAll('.city-list li');
const selectedCityText = document.getElementById('selected-city');
const citySearchInput = document.querySelector('.city-search-input');

// Date Selection
const checkinInput = document.getElementById('checkin-date');
const checkoutInput = document.getElementById('checkout-date');
const selectedDatesText = document.getElementById('selected-dates');

// Guest Selection
const counterBtns = document.querySelectorAll('.counter-btn');
const guestSummaryText = document.getElementById('guest-summary');
const adultsCount = document.getElementById('adults-count');
const childrenCount = document.getElementById('children-count');
const petsCount = document.getElementById('pets-count');

// Search Button
const searchBtn = document.getElementById('search-btn');

// Set minimum date for check-in to today
const today = new Date().toISOString().split('T')[0];
checkinInput.setAttribute('min', today);

// Close all dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.search-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Toggle dropdown
dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        const dropdown = this.querySelector('.search-dropdown');
        const isActive = dropdown.classList.contains('active');
        
        closeAllDropdowns();
        
        if (!isActive) {
            dropdown.classList.add('active');
        }
    });
});

// City Selection Handler
cityList.forEach(city => {
    city.addEventListener('click', function() {
        const cityName = this.getAttribute('data-city');
        searchData.city = cityName;
        selectedCityText.textContent = cityName;
        closeAllDropdowns();
    });
});

// City Search Filter
if (citySearchInput) {
    citySearchInput.addEventListener('input', function(e) {
        e.stopPropagation();
        const searchTerm = this.value.toLowerCase();
        cityList.forEach(city => {
            const cityName = city.getAttribute('data-city').toLowerCase();
            if (cityName.includes(searchTerm)) {
                city.style.display = 'block';
            } else {
                city.style.display = 'none';
            }
        });
    });
}

// Date Selection Handler
checkinInput.addEventListener('change', function() {
    searchData.checkin = this.value;
    checkoutInput.setAttribute('min', this.value);
    updateDateDisplay();
});

checkoutInput.addEventListener('change', function() {
    searchData.checkout = this.value;
    updateDateDisplay();
});

function updateDateDisplay() {
    if (searchData.checkin && searchData.checkout) {
        const checkin = new Date(searchData.checkin);
        const checkout = new Date(searchData.checkout);
        const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        selectedDatesText.textContent = `${nights} night${nights > 1 ? 's' : ''}`;
    } else if (searchData.checkin) {
        selectedDatesText.textContent = 'Add checkout';
    } else {
        selectedDatesText.textContent = 'Anytime';
    }
}

// Guest Counter Handler
counterBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const action = this.getAttribute('data-action');
        const type = this.getAttribute('data-type');
        
        if (action === 'increase') {
            searchData[type]++;
        } else if (action === 'decrease' && searchData[type] > 0) {
            searchData[type]--;
        }
        
        updateGuestDisplay();
    });
});

function updateGuestDisplay() {
    adultsCount.textContent = searchData.adults;
    childrenCount.textContent = searchData.children;
    petsCount.textContent = searchData.pets;
    
    // Update counter button states
    counterBtns.forEach(btn => {
        const action = btn.getAttribute('data-action');
        const type = btn.getAttribute('data-type');
        
        if (action === 'decrease') {
            btn.disabled = searchData[type] === 0;
        }
    });
    
    // Update guest summary text
    const totalGuests = searchData.adults + searchData.children;
    let summary = [];
    
    if (totalGuests > 0) {
        summary.push(`${totalGuests} guest${totalGuests > 1 ? 's' : ''}`);
    }
    if (searchData.pets > 0) {
        summary.push(`${searchData.pets} pet${searchData.pets > 1 ? 's' : ''}`);
    }
    
    guestSummaryText.textContent = summary.length > 0 ? summary.join(', ') : 'Add guests';
}

// Search Button Handler
searchBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    // Validate search data
    if (searchData.city === 'Anywhere') {
        alert('Please select a city');
        return;
    }
    
    if (!searchData.checkin || !searchData.checkout) {
        alert('Please select check-in and check-out dates');
        return;
    }
    
    if (searchData.adults === 0) {
        alert('Please add at least 1 adult guest');
        return;
    }
    
    // Create search summary
    const checkinDate = new Date(searchData.checkin).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
    const checkoutDate = new Date(searchData.checkout).toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
    
    const searchSummary = `
Searching for properties in ${searchData.city}
Check-in: ${checkinDate}
Check-out: ${checkoutDate}
Adults: ${searchData.adults}
Children: ${searchData.children}
Pets: ${searchData.pets}
    `.trim();
    
    console.log('Search Data:', searchData);
    alert(searchSummary);
    
    closeAllDropdowns();
    
    // Here you would typically redirect to a search results page
    // window.location.href = `/search?city=${searchData.city}&checkin=${searchData.checkin}&checkout=${searchData.checkout}&adults=${searchData.adults}&children=${searchData.children}&pets=${searchData.pets}`;
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-dropdown-trigger')) {
        closeAllDropdowns();
    }
});

// Prevent dropdown from closing when clicking inside it
document.querySelectorAll('.search-dropdown').forEach(dropdown => {
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});