// Select relevant DOM elements
const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");
const navLinks = document.querySelectorAll(".nav-link");
const collapsedSidebarHeight = "56px";
const maincontainer = document.getElementsByClassName(".main-container");

// Sidebar toggling
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    updateTooltips();
});

// Toggle menu height
const toggleMenu = (isMenuActive) => {
    sidebar.style.height = isMenuActive 
        ? `${sidebar.scrollHeight}px` 
        : collapsedSidebarHeight;


    maincontainer.style.setProperty('width', isMenuActive ? 'calc(100% - 316px)' : 'calc(100% - 200px)', 'important');


    menuToggler.querySelector("span").innerText = isMenuActive ? "close" :
     "menu"   
};

menuToggler.addEventListener("click", () => {
    toggleMenu(sidebar.classList.toggle("menu-active"));
});

// Update tooltips based on sidebar state
function updateTooltips() {
    const isCollapsed = sidebar.classList.contains("collapsed");

    // Update tooltip visibility when sidebar is collapsed
    navLinks.forEach((link) => {
        const tooltip = link.getAttribute("data-tooltip");
        if (isCollapsed && tooltip) {
            link.setAttribute("title", tooltip);
        } else {
            link.removeAttribute("title");
        }
    });
}

// Initialize tooltips on page load
updateTooltips();


 document.getElementById("filter-form").addEventListener("submit", async (event) => {
            event.preventDefault();
            const startDate = document.getElementById("start-date").value;
            const endDate = document.getElementById("end-date").value;

            const response = await fetch(`/visualize-scores?start_date=${startDate}&end_date=${endDate}`);
            const data = await response.json();

            if (data.image_path) {
                document.getElementById("scores-chart").src = data.image_path;
            }
        });

async function loadImprovements() {
    const testId = document.getElementById("test-id-select").value;
    const response = await fetch(`/get-improvements?test_id=${testId}`);
    const data = await response.json();

    const improvementList = document.getElementById("improvement-list");
    improvementList.innerHTML = "";
    data.improvements.forEach((improvement) => {
        const li = document.createElement("li");
        li.textContent = improvement;
        improvementList.appendChild(li);
    });
}

function uploadFiles(files) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('pdfs', files[i]);
    }

    fetch('/upload_exabuddy', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.files) {
            const list = document.getElementById('uploaded-documents-list');
            list.innerHTML = ""; // Clear current list
            data.files.forEach(file => {
                const li = document.createElement('li');
                li.textContent = file;
                list.appendChild(li);
            });
        }
    })
    .catch(error => console.error('Error:', error));
}

