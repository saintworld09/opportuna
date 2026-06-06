const API_URL = "http://localhost:5000/api/jobs";

export async function getJobs() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch jobs");
    }

    const data = await response.json();

    return (data.jobs || []).map(job => ({
      id: job.guid,
      title: job.title,
      company_name: job.companyName,
      candidate_required_location:
        job.locationRestrictions?.length
          ? job.locationRestrictions.map(l => l.name).join(", ")
          : "Worldwide",
      description: job.description,
      url: job.applicationLink
    }));

  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}