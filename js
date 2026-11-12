
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// SIGN UP

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const studentId = document.getElementById("studentId").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        let users = getData("studentUsers");

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (users.some(user => user.email === email)) {
            alert("This email is already registered.");
            return;
        }

        users.push({
            name: name,
            email: email,
            studentId: studentId,
            password: password
        });

        saveData("studentUsers", users);

        alert("Account created successfully!");
        window.location.href = "login.html";
    });
}


// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value;

        const users = getData("studentUsers");

        const user = users.find(function(account) {
            return account.email === email && account.password === password;
        });

        if (user) {
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            alert("Login successful!");
            window.location.href = "dashboard.html";
        } else {
            alert("Incorrect email or password.");
        }
    });
}


// DASHBOARD

const dashboardWelcome = document.getElementById("dashboardWelcome");

if (dashboardWelcome) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "login.html";
    } else {
        dashboardWelcome.textContent = "Welcome, " + loggedInUser.name + "!";
    }
}

const totalAssignments = document.getElementById("totalAssignments");
const totalNotes = document.getElementById("totalNotes");
const totalSessions = document.getElementById("totalSessions");

if (totalAssignments && totalNotes && totalSessions) {
    totalAssignments.textContent = getData("studentAssignments").length;
    totalNotes.textContent = getData("studentNotes").length;
    totalSessions.textContent = getData("studentTimetable").length;
}


// LOGOUT

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    });
}


// ASSIGNMENTS

const assignmentForm = document.getElementById("assignmentForm");
const assignmentList = document.getElementById("assignmentList");

if (assignmentForm && assignmentList) {
    let assignments = getData("studentAssignments");

    function displayAssignments() {
        assignmentList.innerHTML = "<h2>My Saved Assignments</h2>";

        assignments.forEach(function(assignment, index) {
            const card = document.createElement("div");
            card.className = "assignment-card";

            const title = document.createElement("h3");
            title.textContent = assignment.title;

            const unit = document.createElement("p");
            unit.textContent = "Unit: " + assignment.unit;

            const date = document.createElement("p");
            date.textContent = "Due Date: " + assignment.date;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.addEventListener("click", function() {
                const newTitle = prompt("Enter new assignment title:", assignment.title);
                if (newTitle === null || newTitle.trim() === "") return;

                const newUnit = prompt("Enter new unit name:", assignment.unit);
                if (newUnit === null || newUnit.trim() === "") return;

                const newDate = prompt("Enter new due date (YYYY-MM-DD):", assignment.date);
                if (newDate === null || newDate.trim() === "") return;

                assignments[index] = {
                    title: newTitle.trim(),
                    unit: newUnit.trim(),
                    date: newDate
                };

                saveData("studentAssignments", assignments);
                displayAssignments();
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                if (confirm("Delete this assignment?")) {
                    assignments.splice(index, 1);
                    saveData("studentAssignments", assignments);
                    displayAssignments();
                }
            });

            card.append(title, unit, date, editButton, deleteButton);
            assignmentList.appendChild(card);
        });
    }

    assignmentForm.addEventListener("submit", function(event) {
        event.preventDefault();

        assignments.push({
            title: document.getElementById("assignmentTitle").value.trim(),
            unit: document.getElementById("assignmentUnit").value.trim(),
            date: document.getElementById("assignmentDate").value
        });

        saveData("studentAssignments", assignments);
        assignmentForm.reset();
        displayAssignments();
    });

    displayAssignments();
}


// TIMETABLE

const timetableForm = document.getElementById("timetableForm");
const timetableList = document.getElementById("timetableList");

if (timetableForm && timetableList) {
    let sessions = getData("studentTimetable");

    function displaySessions() {
        timetableList.innerHTML = "<h2>My Saved Study Sessions</h2>";

        sessions.forEach(function(session, index) {
            const card = document.createElement("div");
            card.className = "timetable-card";

            const subject = document.createElement("h3");
            subject.textContent = session.subject;

            const day = document.createElement("p");
            day.textContent = "Day: " + session.day;

            const time = document.createElement("p");
            time.textContent = "Time: " + session.start + " - " + session.end;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                sessions.splice(index, 1);
                saveData("studentTimetable", sessions);
                displaySessions();
            });

            card.append(subject, day, time, deleteButton);
            timetableList.appendChild(card);
        });
    }

    timetableForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const start = document.getElementById("startTime").value;
        const end = document.getElementById("endTime").value;

        if (end <= start) {
            alert("End time must be later than start time.");
            return;
        }

        sessions.push({
            subject: document.getElementById("subject").value.trim(),
            day: document.getElementById("day").value,
            start: start,
            end: end
        });

        saveData("studentTimetable", sessions);
        timetableForm.reset();
        displaySessions();
    });

    displaySessions();
}


// NOTES

const notesForm = document.getElementById("notesForm");
const savedNotes = document.getElementById("savedNotes");

if (notesForm && savedNotes) {
    let notes = getData("studentNotes");

    function displayNotes() {
        savedNotes.innerHTML = "<h2>My Saved Notes</h2>";

        notes.forEach(function(note, index) {
            const card = document.createElement("div");
            card.className = "note-card";

            const title = document.createElement("h3");
            title.textContent = note.title;

            const unit = document.createElement("p");
            unit.textContent = "Unit: " + note.unit;

            const content = document.createElement("p");
            content.textContent = note.content;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                if (confirm("Delete this note?")) {
                    notes.splice(index, 1);
                    saveData("studentNotes", notes);
                    displayNotes();
                }
            });

            card.append(title, unit, content, deleteButton);
            savedNotes.appendChild(card);
        });
    }

    notesForm.addEventListener("submit", function(event) {
        event.preventDefault();

        notes.push({
            title: document.getElementById("noteTitle").value.trim(),
            unit: document.getElementById("noteUnit").value.trim(),
            content: document.getElementById("noteContent").value.trim()
        });

        saveData("studentNotes", notes);
        notesForm.reset();
        displayNotes();
    });

    displayNotes();
}
