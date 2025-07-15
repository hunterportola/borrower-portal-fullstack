import { DocumentStore } from 'ravendb';

// This is the configuration for your RavenDB instance.
// For local development, you might use a URL like "http://localhost:8080"
// and a database name like "BorrowerPortal".
// In production, these should come from your .env file.
const RAVENDB_URL = process.env.RAVENDB_URL || "http://localhost:8080";
const RAVENDB_DATABASE = process.env.RAVENDB_DATABASE || "BorrowerPortal";

const store = new DocumentStore(RAVENDB_URL, RAVENDB_DATABASE);

store.initialize();

console.log(`✅ RavenDB Document Store initialized for database: ${RAVENDB_DATABASE}`);

export default store;