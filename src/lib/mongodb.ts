import mongoose from 'mongoose';

const RAW_MONGODB_URI = process.env.MONGODB_URI;

export function sanitizeMongoUri(rawUri?: string): string | null {
  if (!rawUri) return null;
  let uri = rawUri.trim().replace(/^["']|["']$/g, '');
  try {
    const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.+)$/i);
    if (!schemeMatch) return uri;

    const scheme = schemeMatch[1];
    const rest = schemeMatch[2];

    const lastAtIdx = rest.lastIndexOf('@');
    if (lastAtIdx === -1) return uri;

    const userinfo = rest.slice(0, lastAtIdx);
    const hostAndParams = rest.slice(lastAtIdx + 1);

    const firstColonIdx = userinfo.indexOf(':');
    if (firstColonIdx === -1) return uri;

    const rawUser = userinfo.slice(0, firstColonIdx);
    const rawPass = userinfo.slice(firstColonIdx + 1);

    const user = encodeURIComponent(decodeURIComponent(rawUser));
    const pass = encodeURIComponent(decodeURIComponent(rawPass));

    return `${scheme}${user}:${pass}@${hostAndParams}`;
  } catch (e) {
    return uri;
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = sanitizeMongoUri(RAW_MONGODB_URI);

  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not defined in process.env. Database calls will use fallback initial data.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log('✅ Connected to MongoDB Atlas / Database successfully.');
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}
