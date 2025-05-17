
// Check if user is logged in on page load
window.onload = function() {
    checkLoginStatus();
};

// Show Login Form
function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signUpForm').style.display = 'none';
    document.getElementById('todoSection').style.display = 'none';
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('maincontainer').style.display = 'none';
}
// Show Sign-Up Form
function showSignUpForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signUpForm').style.display = 'block';
    document.getElementById('todoSection').style.display = 'none';
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('maincontainer').style.display = 'none';
}

// Close Login Form
function closeLoginForm() {
    document.getElementById('loginForm').style.display = 'none';
    location.reload(); // Refresh the page
}

// Close Sign-Up Form
function closeSignUpForm() {
    document.getElementById('signUpForm').style.display = 'none';
    location.reload(); // Refresh the page
}

// Login
function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: `Welcome back, ${user.username}!`,
        }).then(() => {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('todoSection').style.display = 'block';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('signUpButton').style.display = 'none';
            document.getElementById('maincontainer').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('auth-buttons').style.display = 'block';
            loadTodos();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid login credentials',
        });
    }
}

// Sign-Up
function signUp() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        Swal.fire({
            icon: 'error',
            title: 'Sign-Up Failed',
            text: 'Username already exists',
        });
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    Swal.fire({
        icon: 'success',
        title: 'Sign-Up Successful!',
        text: `Welcome, ${username}!`,
    }).then(() => {
        closeSignUpForm();
        location.reload(); // Refresh the page
    });
}

// Check Login Status
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('signUpButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'block';
        document.getElementById('todoSection').style.display = 'block';
        document.getElementById('maincontainer').style.display = 'none';
        loadTodos();
    } else {
        document.getElementById('loginButton').style.display = 'block';
        document.getElementById('signUpButton').style.display = 'block';
        document.getElementById('logoutButton').style.display = 'none';
        document.getElementById('todoSection').style.display = 'none';
    }
}

// Log Out
function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Log Out',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('loggedInUser');
            localStorage.removeItem('todos');
            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'You have been logged out.',
            }).then(() => {
                checkLoginStatus();
                location.reload(); // Refresh the page
            });
        }
    });
}

// Add Todo Item
function addTodo() {
    const todoText = document.getElementById('todoInput').value;
    if (!todoText) return;

    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const newTodo = { text: todoText, id: Date.now() };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    document.getElementById('todoInput').value = '';
    loadTodos();
}

// Load Todos
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.innerHTML = `
            ${todo.text}
            <div style="Display : Flex;">
                    <div style="Display : Flex;">
                        <button style=" Display : Flex; Position : End; background-color: #F0F0F0;; color: black;" onclick="editTodo(${todo.id})">Edit</button>
                    </div>
                    <div style="Display : Flex;Margin-Left : 8px;">
                        <button style=" Display : Flex; Position : End; background-color: #CC1F1F; color: white; " onclick="deleteTodo(${todo.id})">Delete</button>
                    </div>
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

// Edit Todo Item
function editTodo(id) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todo = todos.find(t => t.id === id);
    const newText = prompt('Edit your todo:', todo.text);

    if (newText !== null && newText !== '') {
        todo.text = newText;
        localStorage.setItem('todos', JSON.stringify(todos));
        loadTodos();
    }
}


// Delete Todo Item
function deleteTodo(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This todo will be deleted.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            todos = todos.filter(t => t.id !== id);
            localStorage.setItem('todos', JSON.stringify(todos));
            Swal.fire('Deleted!', 'The todo has been deleted.', 'success');
            loadTodos();
        }
    });
}