// Function to display inspiration gallery
  function displayInspirationGallery(currentIndex = 0) {
    const inspirationItems = [
      { url: 'https://via.placeholder.com/300x400?text=Bold+Look', style: 'bold', description: 'Make a statement with vibrant colors like red boots and daring accessories!' },
      { url: 'https://via.placeholder.com/300x400?text=Elegant+Dress', style: 'elegant', description: 'Perfect for a night out, featuring dresses and sophisticated shoes.' },
      { url: 'https://via.placeholder.com/300x400?text=Casual+Vibe', style: 'casual', description: 'Laid-back and comfy, ideal for everyday wear with tops and sneakers.' },
      { url: 'https://via.placeholder.com/300x400?text=Bohemian+Chic', style: 'bohemian', description: 'Flowy dresses and earthy tones for a free-spirited look.' },
      { url: 'https://via.placeholder.com/300x400?text=Sporty+Style', style: 'sporty', description: 'Activewear for gym days or casual outings, with sneakers and leggings.' },
      { url: 'https://via.placeholder.com/300x400?text=Trendy+Style', style: 'trendy', description: 'A modern look with sleek accessories!' }
    ];
    const inspirationDiv = document.getElementById('inspirationItems');
    const descriptionDiv = document.getElementById('inspirationDescription');
    inspirationDiv.innerHTML = '';

    const item = inspirationItems[currentIndex];
    const itemDiv = document.createElement('div');
    itemDiv.className = 'bg-white p-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg mx-auto';
    itemDiv.innerHTML = `<img src="${item.url}" alt="${item.style}" class="w-full h-48 object-cover rounded-md">`;
    itemDiv.addEventListener('click', () => generateOutfit(item.style));
    inspirationDiv.appendChild(itemDiv);
    descriptionDiv.textContent = item.description;

    // Navigation logic
    document.getElementById('prevInspiration').addEventListener('click', () => {
      const newIndex = (currentIndex - 1 + inspirationItems.length) % inspirationItems.length;
      displayInspirationGallery(newIndex);
    });
    document.getElementById('nextInspiration').addEventListener('click', () => {
      const newIndex = (currentIndex + 1) % inspirationItems.length;
      displayInspirationGallery(newIndex);
    });
  }
