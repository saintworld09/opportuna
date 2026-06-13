import { getJobs } from "./api.js";

const jobContainer = document.querySelector(".jobs-container");
const recentContainer = document.querySelector(".recent-jobs-container");

const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

const locationFilter = document.querySelector("#location-filter");
const typeFilter = document.querySelector("#type-filter");
const sortFilter = document.querySelector("#sort-filter");
const resetBtn = document.querySelector("#reset-filters");

let allJobs = [];
let filteredJobs = [];

const JOBS_PER_PAGE = 12;
let currentPage = 1;

/**
 * Initialize jobs
 */
async function initJobs() {
  jobContainer.innerHTML = `
    <div class="loading-container">
      <div class="loader"></div>
      <p>Loading jobs...</p>
    </div>
  `;

  allJobs = await getJobs();
  filteredJobs = [...allJobs];

  if (!allJobs.length) {
    jobContainer.innerHTML = `
      <div class="error-state">
        <h3>No jobs available</h3>
        <p>Please try again later.</p>
      </div>
    `;
    return;
  }

  renderJobs();
  renderPagination();
  renderRecentJobs();
}




/**
 * Render jobs
 */
function renderJobs() {
  const start = (currentPage - 1) * JOBS_PER_PAGE;
  const end = start + JOBS_PER_PAGE;

  const jobsToShow = filteredJobs.slice(start, end);

  if (!jobsToShow.length) {
    jobContainer.innerHTML = `<p>No jobs match your search.</p>`;
    return;
  }

  const savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  jobContainer.innerHTML = jobsToShow
    .map(
      (job) => `
        <div class="job-card" onclick="openJob('${job.id}')">
          <h3>${job.title}</h3>
          <p>${job.company_name}</p>
          <p>${job.candidate_required_location}</p>

          <div class="job-actions">
            <span class="view-btn">View Details</span>

            <button
              class="save-btn"
              onclick="event.stopPropagation(); saveJob('${job.id}')"
            >
              ${savedJobs.includes(job.id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

/**
 * Toast
 */
function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/**
 * Recently viewed jobs
 */
function renderRecentJobs() {
  if (!recentContainer) return;

  const recentIds =
    JSON.parse(localStorage.getItem("recentJobs")) || [];

  if (!recentIds.length) {
    recentContainer.innerHTML = `<p>No recently viewed jobs yet.</p>`;
    return;
  }

  const recentJobsList = allJobs.filter(job =>
    recentIds.includes(job.id)
  );

  recentContainer.innerHTML = recentJobsList
    .map(
      (job) => `
        <div class="job-card" onclick="openJob('${job.id}')">
          <h3>${job.title}</h3>
          <p>${job.company_name}</p>
          <p>${job.candidate_required_location}</p>

          <div class="job-actions">
            <span class="view-btn">View Again</span>
          </div>
        </div>
      `
    )
    .join("");
}

/**
 * Pagination
 */
function renderPagination() {
  const oldPagination = document.querySelector(".pagination");

  if (oldPagination) oldPagination.remove();

  const totalPages = Math.ceil(
    filteredJobs.length / JOBS_PER_PAGE
  );

  if (totalPages <= 1) return;

  const pagination = document.createElement("div");
  pagination.className = "pagination";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");

    button.textContent = i;

    if (i === currentPage) {
      button.classList.add("active-page");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      renderJobs();
      renderPagination();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    pagination.appendChild(button);
  }

  document.body.appendChild(pagination);
}

/**
 * Search
 */
function searchJobs() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) {
    filteredJobs = [...allJobs];
  } else {
    filteredJobs = allJobs.filter(job => {
      return (
        job.title?.toLowerCase().includes(keyword) ||
        job.company_name?.toLowerCase().includes(keyword) ||
        job.candidate_required_location
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }

  currentPage = 1;
  renderJobs();
  renderPagination();
}

searchBtn.addEventListener("click", searchJobs);

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") searchJobs();
});

/**
 * Open job details
 */
window.openJob = function (id) {
  window.location.href = `job-details.html?id=${id}`;
};

function resetFilters() {
  // Reset dropdowns
  locationFilter.value = "all";
  typeFilter.value = "all";
  sortFilter.value = "newest";

  // Reset search
  searchInput.value = "";

  // Reset data
  filteredJobs = [...allJobs];
  currentPage = 1;

  renderJobs();
  renderPagination();
}


/**
 * Save / Unsave job
 */
window.saveJob = function (id) {
  let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  if (savedJobs.includes(id)) {
    savedJobs = savedJobs.filter(jobId => jobId !== id);
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    showToast("Job removed");
  } else {
    savedJobs.push(id);
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    showToast("Job saved successfully!");
  }

  renderJobs();
};

/**
 * Filters
 */
function applyFilters() {
  const location = locationFilter.value;
  const type = typeFilter.value;
  const sort = sortFilter.value;

  filteredJobs = allJobs.filter(job => {
    const text = `
      ${job.title}
      ${job.candidate_required_location}
      ${job.description || ""}
    `.toLowerCase();

    const matchLocation =
      location === "all" || text.includes(location);

    const matchType =
      type === "all" || text.includes(type);

    return matchLocation && matchType;
  });

  if (sort === "newest") {
    filteredJobs.reverse();
  }

  currentPage = 1;
  renderJobs();
  renderPagination();
}

locationFilter.addEventListener("change", applyFilters);
typeFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);
resetBtn.addEventListener("click", resetFilters);
initJobs();