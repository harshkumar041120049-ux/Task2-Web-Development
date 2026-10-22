
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Load saved tasks from the browser
let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("taskflowTasks"));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(task =>
            task &&
            typeof task.text === "string" &&
            typeof task.done === "boolean"
        );
    }
} catch {
    tasks = [];
}

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

// DOM manipulation: create and display task elements
function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = "task-item";

        if (task.done) {
            li.classList.add("done");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "Mark task complete");

        checkbox.addEventListener("change", () => {
            tasks[index].done = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.className = "task-name";
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + task.text);

        deleteButton.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        li.append(checkbox, span, deleteButton);
        taskList.appendChild(li);
    });

    const completed = tasks.filter(task => task.done).length;
    const total = tasks.length;
    const percentage = total ? (completed / total) * 100 : 0;

    progressBar.style.width = percentage + "%";
    progressText.textContent = `${completed} of ${total} completed`;
}

// Add a new task
taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task.");
        return;
    }

    tasks.push({ text, done: false });
    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
});

// Contact form validation
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.style.color = "#b83232";
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.style.color = "#b83232";
        return;
    }

    formStatus.textContent =
        "Form validated successfully! This demo does not send emails yet.";
    formStatus.style.color = "#147d73";

    contactForm.reset();
});

// Dynamic image gallery
const imageForm = document.getElementById("imageForm");
const imageUrl = document.getElementById("imageUrl");
const imageGrid = document.getElementById("imageGrid");

imageForm.addEventListener("submit", event => {
    event.preventDefault();

    const url = imageUrl.value.trim();

    try {
        const parsedUrl = new URL(url);

        if (
            !["https:", "http:"].includes(parsedUrl.protocol) ||
            !parsedUrl.hostname.includes(".")
        ) {
            throw new Error("Invalid image URL");
        }

        const img = document.createElement("img");
        img.src = parsedUrl.href;
        img.alt = "User-added gallery image";
        img.loading = "lazy";

        img.addEventListener("error", () => {
            img.remove();
            alert("Image could not load. Try a direct image URL.");
        }, { once: true });

        imageGrid.appendChild(img);
        imageForm.reset();
    } catch {
        alert("Please enter a valid image URL.");
    }
});

// Click an image to open the lightbox
const lightbox = document.getElementById("lightbox");
const largeImage = document.getElementById("largeImage");
const closeLightbox = document.getElementById("closeLightbox");

imageGrid.addEventListener("click", event => {
    if (event.target.tagName !== "IMG") return;

    largeImage.src = event.target.src;
    largeImage.alt = event.target.alt;
    lightbox.hidden = false;
    closeLightbox.focus();
});

function closeImageViewer() {
    lightbox.hidden = true;
    largeImage.removeAttribute("src");
}

closeLightbox.addEventListener("click", closeImageViewer);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        closeImageViewer();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !lightbox.hidden) {
        closeImageViewer();
    }
});

// Display saved tasks when the page opens
renderTasks();

