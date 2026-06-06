import { getJobs } from "./api.js";

const jobContainer = document.querySelector(".jobs-container");

let allJobs = [];

const JOBS_PER_PAGE = 12;
let currentPage = 1;

/**
 * Initialize jobs
 */
async function initJobs() {
  jobContainer.innerHTML = "<p>Loading jobs...</p>";

  allJobs = await getJobs();

  if (!allJobs.length) {
    jobContainer.innerHTML = "<p>No jobs found.</p>";
    return;
  }

  renderJobs();
  renderPagination();
}

/**
 * Render jobs for current page
 */
function renderJobs() {
  const start = (currentPage - 1) * JOBS_PER_PAGE;
  const end = start + JOBS_PER_PAGE;

  const jobsToShow = allJobs.slice(start, end);

  jobContainer.innerHTML = jobsToShow
    .map(
      (job) => `
      <div class="job-card" onclick="openJob('${job.id}')">
        <h3>${job.title}</h3>
        <p>${job.company_name}</p>
        <p>${job.candidate_required_location}</p>
        <span>View Details</span>
      </div>
    `
    )
    .join("");
}

/**
 * Render pagination buttons
 */
function renderPagination() {
  const oldPagination = document.querySelector(".pagination");

  if (oldPagination) {
    oldPagination.remove();
  }

  const totalPages = Math.ceil(allJobs.length / JOBS_PER_PAGE);

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
 * Open job details page
 */
window.openJob = function (id) {
  window.location.href = `job-details.html?id=${id}`;
};

initJobs();