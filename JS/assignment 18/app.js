const API_URL = "https://api.github.com/users/";
     const defaultUser = "Rizwanjamal";

     const avatar = document.getElementById("avatar");
     const username = document.getElementById("username");
     const email = document.getElementById("email");
     const followers = document.getElementById("followers");
     const repos = document.getElementById("repos");
     const error = document.getElementById("error");
     const searchInput = document.getElementById("searchInput");
     const themeToggle = document.querySelector(".toggle-theme");
     let isDarkTheme = false;

     // Fetch GitHub profile
     function fetchGitHubProfile(user = defaultUser) {
     fetch(API_URL + user)
         .then(response => {
                if (response.status === 404) {
                    throw new Error("User not found");
                }
                return response.json();
         })
         .then(data => {
                updateProfile(data);
                error.textContent = "";
         })
         .catch(err => {
                clearProfile();
                error.textContent = err.message || "Something went wrong!";
         });
     }

     // Update profile details
     function updateProfile(data) {
     avatar.src = data.avatar_url || "";
     username.textContent = data.name || "No Name Provided";
     email.textContent = `Email: ${data.email || "N/A"}`;
     followers.textContent = `Followers: ${data.followers}`;
     repos.textContent = `Repositories: ${data.public_repos}`;
     }

     // Clear profile on error
     function clearProfile() {
     avatar.src = "";
     username.textContent = "No User Found";
     email.textContent = "Email: N/A";
     followers.textContent = "Followers: 0";
     repos.textContent = "Repositories: 0";
     }

     // Toggle theme
     themeToggle.addEventListener("click", () => {
     isDarkTheme = !isDarkTheme;
     document.body.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
     });

     // Search button handler
     searchInput.addEventListener("keypress", event => {
     if (event.key === "Enter") {
         fetchGitHubProfile(searchInput.value.trim());
     }
     });

     // Load default profile on page load
     fetchGitHubProfile();