// Wardrobe array to store items
let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];

// Function to save wardrobe to localStorage
function saveWardrobe() {
  localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
}

// Function to display wardrobe items
function displayWardrobe(filterCategory = 'All') {
  const wardrobeDiv = document.getElementById('wardrobe');
  wardrobeDiv.innerHTML = '';

  const filteredItems = filterCategory === 'All' ? wardrobe : wardrobe.filter(item => item.category === filterCategory);

  filteredItems.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-white p-4 rounded-lg shadow-md relative';
    itemDiv.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/150?text=Clothing+Item'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-2" onerror="this.src='https://via.placeholder.com/150?text=Clothing+Item'; this.alt='Whoops, that image is still playing hide-and-seek with the internet fairies!'">
      <h3 class="text-lg font-semibold">${item.name}</h3>
      <p class="text-sm text-gray-500">${item.category}</p>
      <a href="${item.url}" target="_blank" class="text-blue-500 hover:underline text-sm">View Product</a>
      <button class="absolute top-2 right-2 text-red-500 hover:text-red-700" onclick="removeItem(${index})">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    wardrobeDiv.appendChild(itemDiv);
  });
}

// Function to add a new item
document.getElementById('addItem').addEventListener('click', () => {
  const name = document.getElementById('itemName').value.trim();
  const url = document.getElementById('itemUrl').value.trim();
  const category = document.getElementById('itemCategory').value;
  const imageInput = document.getElementById('itemImage');
  const spinner = document.getElementById('loadingSpinner');

  if (!name || !url) {
    alert('Please enter both item name and URL.');
    return;
  }

  let imageUrl = '';
  if (imageInput.files && imageInput.files[0]) {
    spinner.classList.remove('hidden'); // Show spinner
    const reader = new FileReader();
    reader.onload = function(e) {
      imageUrl = e.target.result;
      wardrobe.push({ name, url, category, image: imageUrl });
      saveWardrobe();
      displayWardrobe(document.getElementById('filterCategory').value);
      spinner.classList.add('hidden'); // Hide spinner
      // Reset form
      document.getElementById('itemName').value = '';
      document.getElementById('itemUrl').value = '';
      document.getElementById('itemImage').value = '';
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    wardrobe.push({ name, url, category, image: '' });
    saveWardrobe();
    displayWardrobe(document.getElementById('filterCategory').value);
    // Reset form
    document.getElementById('itemName').value = '';
    document.getElementById('itemUrl').value = '';
    document.getElementById('itemImage').value = '';
  }
});

// Function to remove an item
window.removeItem = function(index) {
  wardrobe.splice(index, 1);
  saveWardrobe();
  displayWardrobe(document.getElementById('filterCategory').value);
};

// Filter wardrobe by category
document.getElementById('filterCategory').addEventListener('change', (e) => {
  displayWardrobe(e.target.value);
});

// Clear wardrobe
document.getElementById('clearWardrobe').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear your wardrobe?')) {
    wardrobe = [];
    saveWardrobe();
    displayWardrobe(document.getElementById('filterCategory').value);
  }
});

// Export wardrobe
document.getElementById('exportWardrobe').addEventListener('click', () => {
  const dataStr = JSON.stringify(wardrobe);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = 'wardrobe.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
});

// Import wardrobe
document.getElementById('importButton').addEventListener('click', () => {
  document.getElementById('importWardrobe').click();
});

document.getElementById('importWardrobe').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedWardrobe = JSON.parse(e.target.result);
      wardrobe = importedWardrobe;
      saveWardrobe();
      displayWardrobe(document.getElementById('filterCategory').value);
    } catch (err) {
      alert('Error importing wardrobe. Please ensure the file is a valid JSON.');
    }
  };
  reader.readAsText(file);
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

if (isDarkMode) {
  document.body.classList.add('dark-mode');
  darkModeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>';
}

darkModeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  localStorage.setItem('darkMode', isDarkMode);
  darkModeIcon.innerHTML = isDarkMode
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>'
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>';
});

// Initial display of wardrobe
displayWardrobe();
