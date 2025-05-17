// Global array to store user data
let usersData = [];

// Function to handle the signup
function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Validate the inputs
    if (name === '' || email === '' || password === '') {
        alert("All fields are required.");
        return;
    }

    // Check if the email already exists
    if (usersData.some(user => user.email === email)) {
        alert("This email is already registered.");
        return;
    }

    // Create the user record
    const userRecord = {
        name: name,
        email: email,
        password: password
    };

    // Add the user record to the global array
    usersData.push(userRecord);

    // Show success message and switch to login screen
    alert("Signup successful! Please login.");
    showLogin();
}

// Function to handle the login
function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validate the inputs
    if (email === '' || password === '') {
        alert("Both email and password are required.");
        return;
    }

    // Find the user by email
    const user = usersData.find(user => user.email === email);

    // Check if the user exists and the password matches
    if (!user) {
        alert("User not found.");
        return;
    }

    if (user.password !== password) {
        alert("Incorrect password.");
        return;
    }

    // If credentials are correct, show success message
    alert("Login successful!");
}

// Function to show the signup form
function showSignup() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
}

// Function to show the login form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}
