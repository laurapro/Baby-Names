// addBabyName.js

document.addEventListener("DOMContentLoaded", function () {
  const addBabyNameForm = document.getElementById("addBabyNameForm");

  addBabyNameForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const gender = document.getElementById("gender").value;

    // Make a request to add the baby name to the server
    await fetch("http://localhost:3000/addBabyName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, gender }),
    });

    // Redirect to the main page or perform any other action
    window.location.href = "index.html";
  });
});
