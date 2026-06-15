// ==========================================================================
// STATE & CONFIGURATION
// ==========================================================================
let tasks = [];
let activeFilter = 'all';
let searchQuery = '';
let sortBy = 'created-desc';
let editingTaskId = null;

// Initial mockup tasks to show a working system on first load
const DEFAULT_TASKS = [
    {
        id: "1",
        title: "Deploy Portfolio & To-Do app to GitHub Pages",
        category: "Studies",
        priority: "High",
        dueDate: "2026-06-24",
        completed: false,
        created: Date.now() - 3600000 * 24 // 1 day ago
    },
    {
        id: "2",
        title: "Submit AI assignment notice links to professor",
        category: "Studies",
        priority: "High",
        dueDate: "2026-06-24",
        completed: false,
        created: Date.now() - 3600000 * 12 // 12 hours ago
    },
    {
        id: "3",
        title: "Review semantic HTML structure for accessibility compliance",
        category: "Coding",
        priority: "Medium",
        dueDate: "2026-06-20",
        completed: true,
        created: Date.now() - 3600000 * 48 // 2 days ago
    },
    {
        id: "4",
        title: "Update resume education and contact details in index.html",
        category: "Personal",
        priority: "Medium",
        dueDate: "2026-06-18",
        completed: false,
        created: Date.now() - 3600000 * 6 // 6 hours ago
    },
    {
        id: "5",
        title: "Implement glassmorphism styling parameters",
        category: "Coding",
        priority: "Low",
        dueDate: "2026-06-15",
        completed: true,
        created: Date.now() - 3600000 * 72 // 3 days ago
    }
];

// Priority weight definitions for sorting logic
const PRIORITY_WEIGHTS = {
    'High': 3,
    'Medium': 2,
    'Low': 1
};

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initTasks();
    initEventListeners();
});

// ==========================================================================
// SYSTEM 1: THEME & COLOR TOGGLING
// ==========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-theme';
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');

    body.className = savedTheme;

    if (savedTheme === 'light-theme') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

function toggleTheme() {
    const body = document.body;
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    let newTheme = 'dark-theme';

    if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        newTheme = 'light-theme';
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        body.classList.replace('light-theme', 'dark-theme');
        newTheme = 'dark-theme';
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    localStorage.setItem('theme', newTheme);
}

// ==========================================================================
// SYSTEM 2: SINGLE PAGE ROUTING (VIEW MANAGEMENT)
// ==========================================================================
function initNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const views = document.querySelectorAll('.view-panel');
    const projectExploreBtn = document.getElementById('project-explore-btn');

    function switchView(targetViewId) {
        views.forEach(view => {
            if (view.id === targetViewId) {
                view.classList.add('active');
            } else {
                view.classList.remove('active');
            }
        });

        navTabs.forEach(tab => {
            if (tab.getAttribute('data-view') === targetViewId) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            } else {
                tab.classList.remove('active');
                tab.setAttribute('aria-selected', 'false');
            }
        });

        // Trigger animations for skill bars if entering resume view
        if (targetViewId === 'resume-view') {
            animateSkillBars();
        }

        // Scroll to top of view
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.getAttribute('data-view');
            switchView(targetView);
        });
    });

    // Special click handler to open To-Do app from the project card
    if (projectExploreBtn) {
        projectExploreBtn.addEventListener('click', () => {
            switchView('todo-view');
        });
    }

    // Trigger skill animation on startup since page loads on Resume
    animateSkillBars();
}

function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-bar-fill');
    fills.forEach(fill => {
        const targetWidth = fill.style.width;
        fill.style.width = '0%';
        // Trigger reflow/repaint
        void fill.offsetWidth;
        fill.style.width = targetWidth;
    });
}

// ==========================================================================
// SYSTEM 3: TASK CRUD MANAGEMENT
// ==========================================================================
function initTasks() {
    const savedTasks = localStorage.getItem('tasks');
    
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (e) {
            console.error("Error parsing saved tasks, initializing default setup.", e);
            tasks = [...DEFAULT_TASKS];
            saveTasksToStorage();
        }
    } else {
        // Pre-populate with default details on first launch
        tasks = [...DEFAULT_TASKS];
        saveTasksToStorage();
    }

    renderApp();
}

function saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask(title, category, priority, dueDate) {
    const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || "",
        completed: false,
        created: Date.now()
    };

    tasks.unshift(newTask);
    saveTasksToStorage();
    renderApp();
}

function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasksToStorage();
    renderApp();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    renderApp();
}

function updateTask(id, updatedTitle, updatedCategory, updatedPriority, updatedDueDate) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                title: updatedTitle.trim(),
                category: updatedCategory,
                priority: updatedPriority,
                dueDate: updatedDueDate || ""
            };
        }
        return task;
    });
    saveTasksToStorage();
    renderApp();
}

// ==========================================================================
// SYSTEM 4: RENDER ENGINE (FILTERS, SEARCH, ANALYTICS)
// ==========================================================================
function renderApp() {
    renderTaskList();
    renderAnalytics();
}

function renderTaskList() {
    const taskListElement = document.getElementById('task-list');
    const emptyStateElement = document.getElementById('todo-empty-state');
    
    // Clear list
    taskListElement.innerHTML = '';

    // Apply Filter & Search query
    let filteredTasks = tasks.filter(task => {
        // Status filter
        if (activeFilter === 'active' && task.completed) return false;
        if (activeFilter === 'completed' && !task.completed) return false;

        // Search Filter
        if (searchQuery.trim() !== '') {
            const titleMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
            const catMatch = task.category.toLowerCase().includes(searchQuery.toLowerCase());
            return titleMatch || catMatch;
        }

        return true;
    });

    // Apply Sorting
    filteredTasks.sort((a, b) => {
        if (sortBy === 'created-desc') {
            return b.created - a.created; // Newest first
        }
        if (sortBy === 'created-asc') {
            return a.created - b.created; // Oldest first
        }
        if (sortBy === 'priority-desc') {
            const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
            const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
            if (weightA !== weightB) {
                return weightB - weightA; // High priority first
            }
            return b.created - a.created; // Tie-breaker: newest first
        }
        if (sortBy === 'due-date') {
            // Tasks without dates go to the bottom
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate); // Closest due dates first
        }
        return 0;
    });

    // Toggle Empty State Visibility
    if (filteredTasks.length === 0) {
        emptyStateElement.classList.add('active');
        taskListElement.classList.add('hidden');
    } else {
        emptyStateElement.classList.remove('active');
        taskListElement.classList.remove('hidden');

        // Create Task Elements
        filteredTasks.forEach(task => {
            const taskItem = createTaskItemNode(task);
            taskListElement.appendChild(taskItem);
        });
    }
}

function createTaskItemNode(task) {
    const li = document.createElement('li');
    li.className = `task-item glass-card priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    // Format Date & Check Overdue
    let dateHtml = '';
    if (task.dueDate) {
        const formattedDate = formatTaskDate(task.dueDate);
        const isOverdue = checkIsOverdue(task.dueDate) && !task.completed;
        
        dateHtml = `
            <div class="task-meta-item due-date-indicator ${isOverdue ? 'overdue' : ''}">
                <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>${formattedDate}${isOverdue ? ' (Overdue)' : ''}</span>
            </div>
        `;
    }

    // Determine priority badge style
    const priorityBadgeClass = `badge badge-${task.priority.toLowerCase()}`;

    li.innerHTML = `
        <div class="task-left">
            <label class="checkbox-container" aria-label="Toggle Complete State">
                <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox">
                <span class="checkmark">
                    <svg viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
            </label>
            <div class="task-details">
                <span class="task-title">${escapeHTML(task.title)}</span>
                <div class="task-meta">
                    <span class="${priorityBadgeClass}">${task.priority}</span>
                    <span class="category-tag">${task.category}</span>
                    ${dateHtml}
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-task-action action-edit" aria-label="Edit Task Details">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-task-action action-delete" aria-label="Delete Task">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        </div>
    `;

    return li;
}

function renderAnalytics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    
    // Update labels
    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-active').textContent = active;
    document.getElementById('stats-completed').textContent = completed;

    // Update progress bar
    const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
    document.getElementById('stats-progress-percent').textContent = `${progressPercent}%`;
    document.getElementById('stats-progress-bar').style.width = `${progressPercent}%`;
}

// ==========================================================================
// SYSTEM 5: EDIT MODAL WINDOW INTERACTION
// ==========================================================================
function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    
    document.getElementById('edit-task-id').value = task.id;
    document.getElementById('edit-task-name').value = task.title;
    document.getElementById('edit-task-category').value = task.category;
    document.getElementById('edit-task-priority').value = task.priority;
    document.getElementById('edit-task-date').value = task.dueDate;

    const modal = document.getElementById('edit-modal');
    modal.classList.remove('hidden');
    document.getElementById('edit-task-name').focus();
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    modal.classList.add('hidden');
    editingTaskId = null;
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================
function formatTaskDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const year = parts[0];
    const monthIndex = parseInt(parts[1]) - 1;
    const day = parts[2];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[monthIndex]} ${parseInt(day)}, ${year}`;
}

function checkIsOverdue(dateString) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0,0,0,0);
    return dueDate < today;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================================================
// EVENT LISTENERS & DELEGATION
// ==========================================================================
function initEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Form Task Addition
    document.getElementById('todo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-name-input');
        const categorySelect = document.getElementById('task-category-select');
        const prioritySelect = document.getElementById('task-priority-select');
        const dateInput = document.getElementById('task-date-input');

        addTask(
            titleInput.value,
            categorySelect.value,
            prioritySelect.value,
            dateInput.value
        );

        // Reset Form
        titleInput.value = '';
        categorySelect.selectedIndex = 0;
        prioritySelect.value = 'Medium';
        dateInput.value = '';
    });

    // Form Task Modification (Modal Submit)
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingTaskId) return;

        const title = document.getElementById('edit-task-name').value;
        const category = document.getElementById('edit-task-category').value;
        const priority = document.getElementById('edit-task-priority').value;
        const date = document.getElementById('edit-task-date').value;

        updateTask(editingTaskId, title, category, priority, date);
        closeEditModal();
    });

    // Modal Canceling
    document.getElementById('btn-edit-cancel').addEventListener('click', closeEditModal);
    document.getElementById('modal-close').addEventListener('click', closeEditModal);
    
    // Close modal clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('edit-modal');
        if (e.target === modal) {
            closeEditModal();
        }
    });

    // Esc key closes modal
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !document.getElementById('edit-modal').classList.contains('hidden')) {
            closeEditModal();
        }
    });

    // Search bar input filter
    document.getElementById('search-input').addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTaskList();
    });

    // Sorting Dropdown Trigger
    document.getElementById('sort-select').addEventListener('change', (e) => {
        sortBy = e.target.value;
        renderTaskList();
    });

    // Filter toolbar buttons
    const filterButtons = document.querySelectorAll('.filter-group button');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            renderTaskList();
        });
    });

    // Task delegation (Checkbox click, Edit button, Delete button)
    document.getElementById('task-list').addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        
        const taskId = item.getAttribute('data-id');

        // Checkbox complete toggle
        if (e.target.classList.contains('task-checkbox') || e.target.closest('.checkbox-container')) {
            // Stop double firing if clicking label/checkmark
            if (e.target.tagName !== 'INPUT') return; 
            toggleTaskCompletion(taskId);
            return;
        }

        // Edit button click
        if (e.target.closest('.action-edit')) {
            openEditModal(taskId);
            return;
        }

        // Delete button click
        if (e.target.closest('.action-delete')) {
            deleteTask(taskId);
            return;
        }
    });

    // Navbar title clicking redirects to Home (Resume)
    document.getElementById('nav-logo-link').addEventListener('click', (e) => {
        e.preventDefault();
        const tabResume = document.getElementById('tab-resume');
        tabResume.click();
    });
}
