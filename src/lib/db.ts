import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

const cached: {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
} = { conn: null, promise: null }

mongoose.set("toJSON", {
  virtuals: true,
  transform(_doc: any, ret: any) {
    if (ret._id) {
      ret.id = ret._id.toString()
      delete ret.__v
    }
    return ret
  },
})

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}
