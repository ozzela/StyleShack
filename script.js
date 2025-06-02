// Wardrobe array to store items
let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || [];

// Function to save wardrobe to localStorage
function saveWardrobe() {
  localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
}

// Function to display wardrobe items
function displayWardrobe() {
  const wardrobeDiv = document.getElementById('wardrobe');
  wardrobeDiv.innerHTML = '';

  wardrobe.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-white p-4 rounded-lg shadow-md relative';
    itemDiv.innerHTML = `
      <img src="${item.image || 'https://via.placeholder.com/150?text=Clothing+Item'}" alt="${item.name}" class="w-full h-48 object-cover rounded-md mb-2" onerror="this.src='https://via.placeholder.com/150?text=Clothing+Item'; this.alt='Whoops, that image is still playing hide-and-seek with the internet fairies!'">
      <h3 class="text-lg font-semibold">${item.name}</h3>
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
  const imageInput = document.getElementById('itemImage');

  if (!name || !url) {
    alert('Please enter both item name and URL.');
    return;
  }

  let imageUrl = '';
  if (imageInput.files && imageInput.files[0]) {
    // Use FileReader to convert uploaded image to data URL
    const reader = new FileReader();
    reader.onload = function(e) {
      imageUrl = e.target.result;
      wardrobe.push({ name, url, image: imageUrl });
      saveWardrobe();
      displayWardrobe();
      // Reset form
      document.getElementById('itemName').value = '';
      document.getElementById('itemUrl').value = '';
      document.getElementById('itemImage').value = '';
    };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    // Use placeholder image if no image is uploaded
    wardrobe.push({ name, url, image: '' });
    saveWardrobe();
    displayWardrobe();
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
  displayWardrobe();
};

// Initial display of wardrobe
displayWardrobe();