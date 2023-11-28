// main.js

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const babyNameDisplay = document.getElementById("babyNameDisplay");
  const likeButton = document.getElementById("likeButton");
  const dislikeButton = document.getElementById("dislikeButton");
  const imageContainer = document.querySelector(".image-container");

  let currentBabyName = null;

  // Function to fetch a random baby name
  async function fetchRandomBabyName() {
    const response = await fetch("http://localhost:3001/getRandomBabyName");
    const babyName = await response.json();
    return babyName;
  }

  // Function to update the baby name display
  function updateBabyNameDisplay() {
    fetchRandomBabyName().then((babyName) => {
      currentBabyName = babyName;
      babyNameDisplay.textContent = babyName.name;

      // Set background color based on gender
      body.style.backgroundColor = getBackgroundColor(babyName.gender);
      // Set image URL based on gender
      imageContainer.style.backgroundImage = `url(${getImageUrl(
        babyName.gender
      )})`;
    });
  }

  // Function to determine background color based on gender
  function getBackgroundColor(gender) {
    switch (gender) {
      case "girl":
        return "lightpink";
      case "boy":
        return "lightblue";
      case "neutral":
        return "lightyellow";
      default:
        return "white"; // Default color
    }
  }

  // Function to determine image URL based on gender
  function getImageUrl(gender) {
    switch (gender) {
      case "girl":
        return "https://images.pexels.com/photos/906150/pexels-photo-906150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
      case "boy":
        return "https://images.pexels.com/photos/248704/pexels-photo-248704.jpeg?auto=compress&cs=tinysrgb&w=800";
      case "neutral":
        return "https://images.pexels.com/photos/212324/pexels-photo-212324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
      default:
        return "https://images.pexels.com/photos/212324/pexels-photo-212324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2g";
    }
  }

  // Function to handle liking a baby name
  function likeBabyName() {
    if (currentBabyName) {
      // Make a request to update popularity (increase by 1)
      updatePopularity(currentBabyName.name, 1);
      // Fetch and display a new random baby name
      updateBabyNameDisplay();
    }
  }

  // Function to handle disliking a baby name
  function dislikeBabyName() {
    if (currentBabyName) {
      // Make a request to update popularity (decrease by 1)
      updatePopularity(currentBabyName.name, -1);
      // Fetch and display a new random baby name
      updateBabyNameDisplay();
    }
  }

  // Attach event listeners to buttons
  likeButton.addEventListener("click", likeBabyName);
  dislikeButton.addEventListener("click", dislikeBabyName);

  // Initial display of a random baby name
  updateBabyNameDisplay();
});

// Function to update the popularity of a baby name
async function updatePopularity(name, increment) {
  await fetch(`http://localhost:3000/updatePopularity/${name}/${increment}`, {
    method: "POST",
  });
}
