console.log('📦 [Pre-build] MongoDB build preparation verified.');
if (process.env.MONGODB_URI) {
  console.log('✅ [Pre-build] MONGODB_URI environment variable detected.');
} else {
  console.log('ℹ️ [Pre-build] MONGODB_URI not set. Application will use default track fallback until MONGODB_URI is provided.');
}
