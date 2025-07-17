import { DocumentStore } from 'ravendb';

// This is the configuration for your RavenDB instance.
const RAVENDB_URL = process.env.RAVENDB_URL || "http://localhost:8080";

// Auth database (SharedUsers) - for authentication and user management
const AUTH_DATABASE = process.env.AUTH_DATABASE || "SharedUsers";
const authStore = new DocumentStore(RAVENDB_URL, AUTH_DATABASE);
authStore.initialize();
console.log(`✅ Auth RavenDB Store initialized for database: ${AUTH_DATABASE}`);

// Borrower Portal database - for loan and borrower data
const BORROWER_DATABASE = process.env.BORROWER_DATABASE || "BorrowerPortal";
const borrowerStore = new DocumentStore(RAVENDB_URL, BORROWER_DATABASE);
borrowerStore.initialize();
console.log(`✅ Borrower RavenDB Store initialized for database: ${BORROWER_DATABASE}`);

// Export auth store as default for backward compatibility
export default authStore;
export { borrowerStore };