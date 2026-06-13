import { getJobs } from "./api.js";

const container = document.querySelector(".job-details");

/**
 * Get job ID from URL
 */
function getJobId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

container.innerHTML = `
  <div class="loading-container">
    <div class="loader"></div>
    <p>Loading job details...</p>
  </div>
`;

/**
 * Show toast message
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
 * Load job details
 */
async function loadJobDetails() {
  try {
    const id = getJobId();

    if (!id) {
      container.innerHTML = `
        <div style="padding:20px;">
          <h2>Invalid job link</h2>
          <a href="./index.html">Go back home</a>
        </div>
      `;
      return;
    }

    const jobs = await getJobs();

    const job = jobs.find(j => String(j.id) === String(id));

    // If job not found → STOP here
    if (!job) {
      container.innerHTML = `
        <div style="padding:20px;">
          <h2>Job not found</h2>
          <a href="./index.html">Go back home</a>
        </div>
      `;
      return;
    }

    // ✅ Save recently viewed job (SAFE)
    let recentJobs = JSON.parse(localStorage.getItem("recentJobs")) || [];

const jobUrl = job.url; // IMPORTANT

if (jobUrl) {
  recentJobs = recentJobs.filter(url => url !== jobUrl);

  recentJobs.unshift(jobUrl);

  recentJobs = recentJobs.slice(0, 5);

  localStorage.setItem("recentJobs", JSON.stringify(recentJobs));
}

    // Render UI
    container.innerHTML = `
      <div class="job-detail-card">

        <div class="job-header">
          <h1>${job.title || "No title available"}</h1>
          <p class="company-name">
            ${job.company_name || "Unknown company"}
          </p>
        </div>

        <div class="job-meta">
          <p>
            <strong>Location:</strong>
            ${job.candidate_required_location || "Worldwide"}
          </p>

          <p>
            <strong>Job ID:</strong>
            ${job.id}
          </p>
        </div>

        <div class="job-description">
          <h2>Job Description</h2>
          ${
            job.description
              ? job.description.length > 1000
                ? job.description.slice(0, 1000) + "..."
                : job.description
              : "No description available"
          }
        </div>

        <div class="job-actions">

          ${
            job.url && job.url.startsWith("http")
              ? `
                <a href="${job.url}"
                   target="_blank"
                   rel="noopener noreferrer">
                  <button class="apply-btn">
                    Apply Now
                  </button>
                </a>
              `
              : `
                <button class="apply-btn" disabled>
                  No Application Link Available
                </button>
              `
          }

          <button
            class="save-btn"
            onclick="saveJob('${job.id}')">
            Save Job
          </button>

        </div>

      </div>
    `;

  } catch (error) {
    console.error("Job Details Error:", error);

    container.innerHTML = `
      <div style="padding:20px;">
        <h2>Error loading job details</h2>
        <a href="./index.html">Go back home</a>
      </div>
    `;
  }
}

loadJobDetails();

/**
 * Save job to localStorage
 */
window.saveJob = function (id) {
  let savedJobs =
    JSON.parse(localStorage.getItem("savedJobs")) || [];

  if (!savedJobs.includes(id)) {
    savedJobs.push(id);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(savedJobs)
    );

    showToast("Job saved successfully!");
  } else {
    showToast("Job already saved.");
  }
};