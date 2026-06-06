const BASE_URL = "https://remotive.com/api/remote-jobs";

/**
 * Fetch jobs from a single endpoint safely
 */
async function fetchFromUrl(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${url}`);
    }

    const data = await response.json();

    // Ensure jobs array exists
    return Array.isArray(data.jobs) ? data.jobs : [];

  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

/**
 * Fetch all jobs (multi-source + cleaned)
 */
export async function getJobs() {
  try {
    const urls = [
      `${BASE_URL}?limit=1000`,
      `${BASE_URL}?limit=50&category=software-dev`,
      `${BASE_URL}?limit=50&category=marketing`,
      `${BASE_URL}?limit=50&category=design`,
      `${BASE_URL}?limit=50&category=sales-specialist`,
      `${BASE_URL}?limit=50&category=customer-service`
    ];

    // Fetch all sources in parallel
    const results = await Promise.all(urls.map(fetchFromUrl));

    // Merge all jobs
    let allJobs = results.flat();

    // ✅ STEP 1: Remove jobs without essential data
    allJobs = allJobs.filter(job =>
      job &&
      job.id &&
      job.title &&
      job.company_name
    );

    // STEP 2: AFRICA-FRIENDLY FILTER ENGINE
    allJobs = allJobs.filter(job => {
      const text = `
        ${job.title}
        ${job.description || ""}
        ${job.candidate_required_location || ""}
      `.toLowerCase();


    // ❌ REJECT restricted jobs
      const blockedPatterns = [
        "united states only",
        "us only",
        "usa only",
        "canada only",
        "uk only",
        "europe only",
        "must be located in",
        "residents only"
      ];

     const isBlocked = blockedPatterns.some(pattern =>
        text.includes(pattern)
      );

    // ✅ ACCEPT global jobs
      const isGlobal = [
        "worldwide",
        "anywhere",
        "remote",
        "global",
        "work from anywhere",
        "open worldwide"
      ].some(keyword => text.includes(keyword));

      return !isBlocked || isGlobal;
    });


    // ✅ STEP 2: Remove duplicates (by ID)
    const uniqueJobs = Array.from(
      new Map(allJobs.map(job => [job.id, job])).values()
    );

    // ✅ STEP 3 (OPTIONAL BUT IMPORTANT): Prioritize jobs with apply links
    const sortedJobs = uniqueJobs.sort((a, b) => {
      const aHasUrl = a.url ? 1 : 0;
      const bHasUrl = b.url ? 1 : 0;
      return bHasUrl - aHasUrl;
    });

    return sortedJobs;

  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}