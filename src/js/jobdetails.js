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

    // If job not found
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
      <h1>${job.title || "No title available"}</h1>
      <h3>${job.company_name || "Unknown company"}</h3>

      <p><strong>Location:</strong> ${job.candidate_required_location || "Worldwide"}</p>

      <br/>

      <div>
        ${
          job.description
            ? job.description.length > 500
              ? job.description.slice(0, 500) + "..."
              : job.description
            : "No description available"
        }
      </div>

      <br/>

      ${
        job.url && job.url.startsWith("http")
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