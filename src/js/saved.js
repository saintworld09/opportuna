import { getJobs } from "./api.js";

const container = document.querySelector(".jobs-container");

/**
 * Toast Notification
 */
function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/**
 * Load Saved Jobs
 */
async function loadSavedJobs() {
  container.innerHTML = `
    <div class="loading-container">
      <div class="loader"></div>
      <p>Loading saved jobs...</p>
    </div>
  `;

  const allJobs = await getJobs();

  const savedIds =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  const savedJobs = allJobs.filter(job =>
    savedIds.includes(String(job.id))
  );

  // Empty State
  if (!savedJobs.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h2>No Saved Jobs Yet</h2>
        <p>
          Save jobs from the homepage and
          they will appear here.
        </p>

        <a href="index.html">
          <button class="apply-btn">
            Browse Jobs
          </button>
        </a>
      </div>
    `;
    return;
  }

  // Saved Jobs Header
  container.innerHTML = `
    <div class="saved-header">
      <h2>
        Saved Jobs (${savedJobs.length})
      </h2>
    </div>

    <div class="saved-jobs-grid">
      ${savedJobs
        .map(
          job => `
            <div class="job-card">

              <h3>${job.title}</h3>

              <p>${job.company_name}</p>

              <p>
                ${job.candidate_required_location}
              </p>

              <div class="job-actions">

                <button
                  class="view-btn"
                  onclick="openJob('${job.id}')"
                >
                  View Details
                </button>

                <button
                  class="save-btn"
                  onclick="removeSaved('${job.id}')"
                >
                  Remove
                </button>

              </div>

            </div>
          `
        )
        .join("")}
    </div>
  `;
}

/**
 * Remove Saved Job
 */
window.removeSaved = function (id) {
  let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  savedJobs = savedJobs.filter(
    jobId => String(jobId) !== String(id)
  );

  localStorage.setItem(
    "savedJobs",
    JSON.stringify(savedJobs)
  );

  showToast("Job removed from saved jobs");

  loadSavedJobs();
};

/**
 * Open Job Details
 */
window.openJob = function (id) {
  window.location.href = `job-details.html?id=${id}`;
};

loadSavedJobs();