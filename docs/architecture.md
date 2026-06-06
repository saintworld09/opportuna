# Opportuna Architecture

## Overview
Opportuna is a job search platform that fetches real-time job listings from external APIs and allows users to search, filter, and save jobs.

## Modules

### 1. UI Module
Handles all page layouts:
- Home page
- Jobs listing page
- Job details page
- Saved jobs page

### 2. API Module
Responsible for fetching job data from external APIs (Remotive / Adzuna).

### 3. Search Module
Handles keyword-based job search functionality.

### 4. Filter & Sort Module
Filters jobs by:
- Location
- Job type
- Date posted
Sorts by:
- Newest
- Oldest

### 5. Bookmark Module
Stores and retrieves saved jobs using localStorage.

### 6. Utility Module
Handles helper functions like date formatting and reusable logic.

## Data Flow
User → UI → Event Handling → API Module → External API → UI Update

## Storage
- localStorage is used for saved jobs only.