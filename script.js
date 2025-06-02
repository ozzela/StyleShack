document.addEventListener('DOMContentLoaded', () => {
  console.log('script.js loaded successfully');

  // Wardrobe and favorites arrays
  let wardrobe = [];
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  try {
    const storedWardrobe = localStorage.getItem('wardrobe');
    wardrobe = storedWardrobe ? JSON.parse(storedWardrobe) : [];
  } catch (error) {
    console.error('Error parsing wardrobe from localStorage:', error);
    wardrobe = [];
  }

  // Function to save wardrobe and favorites to localStorage with error handling
  function saveData() {
    try {
      localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Storage limit reached! Please remove some items or use smaller images.');
      throw error; // Stop further processing if storage fails
    }
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
        <button class="favorite-btn ${favorites.includes(index) ? 'favorited' : ''}" onclick="toggleFavorite(${index})">
          ♥
        </button>
      `;
      wardrobeDiv.appendChild(itemDiv);
    });
  }

  // Function to display favorites
  function displayFavorites() {
    const favoriteDiv = document.getElementById('favoriteItems');
    favoriteDiv.innerHTML = '';
    favorites.forEach(index => {
      if (wardrobe[index]) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-white p-4 rounded-lg shadow-md relative';
        itemDiv.innerHTML = `
          <img src="${wardrobe[index].image || 'https://via.placeholder.com/150?text=Clothing+Item'}" alt="${wardrobe[index].name}" class="w-full h-48 object-cover rounded-md mb-2">
          <h3 class="text-lg font-semibold">${wardrobe[index].name}</h3>
          <p class="text-sm text-gray-500">${wardrobe[index].category}</p>
          <a href="${wardrobe[index].url}" target="_blank" class="text-blue-500 hover:underline text-sm">View Product</a>
        `;
        favoriteDiv.appendChild(itemDiv);
      }
    });
    document.getElementById('favorites').classList.toggle('hidden', favorites.length === 0);
  }

  // Function to display generated outfit
  function displayGeneratedOutfit(outfit) {
    const outfitDiv = document.getElementById('outfitItems');
    outfitDiv.innerHTML = '';
    outfit.forEach(item => {
      if (item) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-white p-4 rounded-lg shadow-md';
        itemDiv.innerHTML = `
          <img src="${item.image || 'https://via.placeholder.com/150?text=Clothing+Item'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-2">
          <h3 class="text-lg font-semibold">${item.name}</h3>
          <p class="text-sm text-gray-500">${item.category}</p>
        `;
        outfitDiv.appendChild(itemDiv);
      }
    });
    document.getElementById('generatedOutfit').classList.toggle('hidden', outfit.some(item => !item));
  }

  // Function to generate a random outfit
  function generateOutfit() {
    const tops = wardrobe.filter(item => item.category === 'Tops');
    const bottoms = wardrobe.filter(item => item.category === 'Bottoms');
    const accessories = wardrobe.filter(item => item.category === 'Accessories');
    const shoes = wardrobe.filter(item => item.category === 'Shoes');

    const outfit = [
      tops.length ? tops[Math.floor(Math.random() * tops.length)] : null,
      bottoms.length ? bottoms[Math.floor(Math.random() * bottoms.length)] : null,
      accessories.length ? accessories[Math.floor(Math.random() * accessories.length)] : null,
      shoes.length ? shoes[Math.floor(Math.random() * shoes.length)] : null
    ];

    displayGeneratedOutfit(outfit);
    if (outfit.some(item => !item)) {
      alert('Not enough items in some categories to generate a complete outfit. Add more items!');
    }
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
      const file = imageInput.files[0];
      // Check file size (limit to 1MB to prevent localStorage issues)
      if (file.size > 1024 * 1024) {
        alert('Image is too large! Please use an image smaller than 1MB.');
        return;
      }

      spinner.classList.remove('hidden'); // Show spinner
      const reader = new FileReader();

      reader.onload = function(e) {
        try {
          imageUrl = e.target.result;
          wardrobe.push({ name, url, category, image: imageUrl });
          saveData();
          displayWardrobe(document.getElementById('filterCategory').value);
          spinner.classList.add('hidden'); // Hide spinner
          // Reset form
          document.getElementById('itemName').value = '';
          document.getElementById('itemUrl').value = '';
          document.getElementById('itemImage').value = '';
        } catch (error) {
          console.error('Error adding item with image:', error);
          spinner.classList.add('hidden'); // Hide spinner on error
          alert('Failed to add item. Storage may be full or image processing failed.');
        }
      };

      reader.onerror = function() {
        console.error('Error reading file with FileReader');
        spinner.classList.add('hidden'); // Hide spinner on error
        alert('Error reading the image file. Please try a different image.');
      };

      reader.readAsDataURL(file);
    } else {
      try {
        wardrobe.push({ name, url, category, image: '' });
        saveData();
        displayWardrobe(document.getElementById('filterCategory').value);
        // Reset form
        document.getElementById('itemName').value = '';
        document.getElementById('itemUrl').value = '';
        document.getElementById('itemImage').value = '';
      } catch (error) {
        console.error('Error adding item without image:', error);
        alert('Failed to add item. Storage may be full.');
      }
    }
  });

  // Function to remove an item
  window.removeItem = function(index) {
    wardrobe.splice(index, 1);
    favorites = favorites.filter(fav => fav !== index && fav > index);
    saveData();
    displayWardrobe(document.getElementById('filterCategory').value);
    displayFavorites();
    document.getElementById('generatedOutfit').classList.add('hidden');
  };

  // Function to toggle favorite
  window.toggleFavorite = function(index) {
    const favIndex = favorites.indexOf(index);
    if (favIndex === -1) {
      favorites.push(index);
    } else {
      favorites.splice(favIndex, 1);
    }
    saveData();
    displayWardrobe(document.getElementById('filterCategory').value);
    displayFavorites();
  };

  // Filter wardrobe by category
  document.getElementById('filterCategory').addEventListener('change', (e) => {
    displayWardrobe(e.target.value);
  });

  // Clear wardrobe
  document.getElementById('clearWardrobe').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear your wardrobe?')) {
      wardrobe = [];
      favorites = [];
      saveData();
      displayWardrobe(document.getElementById('filterCategory').value);
      displayFavorites();
      document.getElementById('generatedOutfit').classList.add('hidden');
    }
  });

  // Export wardrobe
  document.getElementById('exportWardrobe').addEventListener('click', () => {
    const dataStr = JSON.stringify({ wardrobe, favorites });
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
        const data = JSON.parse(e.target.result);
        wardrobe = data.wardrobe || [];
        favorites = data.favorites || [];
        saveData();
        displayWardrobe(document.getElementById('filterCategory').value);
        displayFavorites();
      } catch (err) {
        alert('Error importing wardrobe. Please ensure the file is a valid JSON.');
      }
    };
    reader.readAsText(file);
  });

  // Generate outfit
  document.getElementById('generateOutfit').addEventListener('click', generateOutfit);

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

  // Initial display
  displayWardrobe();
  displayFavorites();
});
