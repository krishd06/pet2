import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConn = null;
let cachedPromise = null;

// In-memory collection fallback when MONGODB_URI is not set
class InMemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  async find(filter = {}) {
    let result = [...this.docs];
    for (const [key, val] of Object.entries(filter)) {
      if (val !== undefined && val !== null) {
        if (typeof val === 'object' && val.$in) {
          result = result.filter(d => val.$in.includes(d[key]));
        } else {
          result = result.filter(d => d[key] === val);
        }
      }
    }
    return result;
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async create(doc) {
    const newDoc = {
      _id: 'mock_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...doc
    };
    this.docs.push(newDoc);
    return newDoc;
  }

  async insertMany(docs) {
    const created = docs.map(d => ({
      _id: 'mock_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...d
    }));
    this.docs.push(...created);
    return created;
  }

  async updateOne(filter, update, options = {}) {
    const existing = await this.findOne(filter);
    if (existing) {
      const setFields = update.$set || update;
      Object.assign(existing, setFields, { updatedAt: new Date() });
      return { matchedCount: 1, modifiedCount: 1 };
    } else if (options.upsert) {
      const newDoc = await this.create({ ...filter, ...(update.$set || update) });
      return { matchedCount: 0, modifiedCount: 0, upsertedId: newDoc._id };
    }
    return { matchedCount: 0, modifiedCount: 0 };
  }

  async deleteMany(filter = {}) {
    if (Object.keys(filter).length === 0) {
      const count = this.docs.length;
      this.docs = [];
      return { deletedCount: count };
    }
    const toKeep = [];
    let count = 0;
    for (const d of this.docs) {
      let matches = true;
      for (const [k, v] of Object.entries(filter)) {
        if (d[k] !== v) matches = false;
      }
      if (matches) count++;
      else toKeep.push(d);
    }
    this.docs = toKeep;
    return { deletedCount: count };
  }
}

export const inMemoryMongoStores = {
  PetContent: new InMemoryCollection('PetContent'),
  QuestionnaireDefinition: new InMemoryCollection('QuestionnaireDefinition'),
  ExplanationTemplates: new InMemoryCollection('ExplanationTemplates'),
  RemediationTemplates: new InMemoryCollection('RemediationTemplates'),
  OnboardingGuides: new InMemoryCollection('OnboardingGuides'),
  FaqItems: new InMemoryCollection('FaqItems'),
  AdvisorConversations: new InMemoryCollection('AdvisorConversations')
};

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '' || uri.includes('placeholder')) {
    return { isMock: true, clientType: 'in_memory_dev_store' };
  }

  if (cachedConn) {
    return { isMock: false, clientType: 'mongodb_atlas', connection: cachedConn };
  }

  if (!cachedPromise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    };

    cachedPromise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cachedConn = await cachedPromise;
    return { isMock: false, clientType: 'mongodb_atlas', connection: cachedConn };
  } catch (err) {
    console.warn('MongoDB Atlas connection failed, falling back to in-memory store:', err.message);
    cachedPromise = null;
    return { isMock: true, clientType: 'in_memory_dev_store' };
  }
}

export async function checkMongoHealth() {
  const start = Date.now();
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '' || uri.includes('placeholder')) {
    return {
      status: 'healthy',
      clientType: 'in_memory_dev_store',
      latencyMs: Date.now() - start
    };
  }

  try {
    const { connection, isMock } = await connectMongo();
    if (isMock) {
      return {
        status: 'healthy',
        clientType: 'in_memory_dev_store',
        latencyMs: Date.now() - start
      };
    }
    const state = mongoose.connection.readyState;
    // 1 = connected
    if (state === 1) {
      return {
        status: 'healthy',
        clientType: 'mongodb_atlas',
        latencyMs: Date.now() - start
      };
    }
    return {
      status: 'connecting',
      clientType: 'mongodb_atlas',
      latencyMs: Date.now() - start
    };
  } catch (err) {
    return {
      status: 'unhealthy',
      error: err.message,
      latencyMs: Date.now() - start
    };
  }
}
