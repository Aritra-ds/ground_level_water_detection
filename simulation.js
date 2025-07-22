document.addEventListener('DOMContentLoaded', () => {
    const circles = document.querySelectorAll('.circle');
    const img = document.getElementById('simulation-image');
  
    circles.forEach((circle) => {
      circle.addEventListener('click', async () => {
        alert(`You clicked on ${circle.parentElement.querySelector('p').innerText}!`);
        
        // Fetch the latest simulation frame
        try {
          const response = await fetch('/simulate');
          if (!response.ok) {
            throw new Error('Failed to fetch simulation image');
          }
          const blob = await response.blob();
          img.src = URL.createObjectURL(blob); // Set the image source
        } catch (error) {
          console.error(error);
          alert('Error fetching the simulation image.');
        }
      });
    });
  });
  