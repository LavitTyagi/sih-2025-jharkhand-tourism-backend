/**
 * Database Configuration
 *
 * Handles MongoDB connection using Mongoose.
 * Provides connection function and event handling for database lifecycle.
 */

import mongoose from 'mongoose';

/**
 * MongoDB connection URI from environment variables.
 */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sih-2025-jharkhand-tourism';

/**
 * Connects to MongoDB database.
 *
 * Establishes connection using Mongoose and sets up event listeners
 * for connection status monitoring.
 *
 * @returns Promise that resolves when connection is established
 * @throws Error if connection fails
 */
export async function connectDB(): Promise<void> {
	try {
		// Set up connection event handlers
		mongoose.connection.on('connected', () => {
			console.log('📦 MongoDB connected successfully');
		});

		mongoose.connection.on('error', (err) => {
			console.error('❌ MongoDB connection error:', err.message);
		});

		mongoose.connection.on('disconnected', () => {
			console.log('⚠️  MongoDB disconnected');
		});

		// Handle process termination gracefully
		process.on('SIGINT', async () => {
			await mongoose.connection.close();
			console.log('MongoDB connection closed due to app termination');
			process.exit(0);
		});

		// Connect to MongoDB
		await mongoose.connect(MONGO_URI);

	} catch (error) {
		console.error('❌ Failed to connect to MongoDB:', error);
		process.exit(1);
	}
}

/**
 * Disconnects from MongoDB database.
 *
 * Useful for graceful shutdown and testing.
 */
export async function disconnectDB(): Promise<void> {
	await mongoose.connection.close();
}
