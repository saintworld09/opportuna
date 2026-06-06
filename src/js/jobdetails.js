import { getJobs } from "./api.js";

const container = document.querySelector(".job-details");

/**
 * Get job ID from URL
 */
function getJobId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

/**
 * Load job details
 */
async function loadJobDetails() {
  try {
    const id = getJobId();

    const jobs = await getJobs();

    const job = jobs.find(j => String(j.id) === String(id));

    // Handle missing job safely
    if (!job) {
      container.innerHTML = `
        <div style="padding:20px;">
          <h2>Job not found</h2>
          <a href="./index.html">Go back home</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <h1>${job.title}</h1>
      <h3>${job.company_name}</h3>

      <p><strong>Location:</strong> ${job.candidate_required_location}</p>

      <br/>

      <div>
        ${job.description ? job.description.slice(0, 500) + "..." : "No description available"}
      </div>

      <br/>

      <!-- APPLY BUTTON (SAFE VERSION) -->
      ${
        job.url
          ? `
            <a href="${job.url}" target="_blank" rel="noopener noreferrer">
              <button class="apply-btn">Apply Now</button>
            </a>
          `
          : `
            <button class="apply-btn" disabled>
              No Application Link Available
            </button>
          `
      }
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