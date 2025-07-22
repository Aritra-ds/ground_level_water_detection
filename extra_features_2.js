// Get the modal element
const modal = document.getElementById("subscriptionModal");

// Get the close button
const closeBtn = document.querySelector(".close");

// Show the modal when any feature box is clicked
document.querySelectorAll(".feature-box").forEach(featureBox => {
    featureBox.addEventListener("click", () => {
        modal.style.display = "block";
    });
});

// Close the modal when the close button is clicked
closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

// Handle subscription form submission
document.getElementById("subscriptionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Subscription successful! Thank you for subscribing.");
    modal.style.display = "none";
    // You can add further processing for the subscription details here
});
