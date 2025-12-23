/**
 * Products Controller
 *
 * Handles all CRUD operations for product listings.
 */

import { Request, Response } from 'express';
import {
	Product,
	CreateProductInput,
	UpdateProductInput,
	productsStore
} from '../models/products/Product.model';
import {
	sendSuccess,
	sendError,
	getPaginationMeta,
	parsePaginationParams,
	generateId
} from '../utils/response.utils';

/**
 * GET /api/products
 *
 * Retrieves all products with pagination and optional filters.
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 12, max: 100)
 * - category: Filter by category
 */
export function getAllProducts(req: Request, res: Response): void {
	const { page, limit } = parsePaginationParams(
		req.query.page as string,
		req.query.limit as string,
		12 // Default limit for products
	);
	const category = req.query.category as string | undefined;

	// Apply filters
	let filtered = [...productsStore];

	if (category) {
		filtered = filtered.filter(p =>
			p.category.toLowerCase() === category.toLowerCase()
		);
	}

	// Paginate results
	const startIndex = (page - 1) * limit;
	const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

	sendSuccess(res, {
		products: paginatedProducts,
		pagination: getPaginationMeta(page, limit, filtered.length)
	});
}

/**
 * GET /api/products/:id
 *
 * Retrieves a single product by ID.
 */
export function getProductById(req: Request, res: Response): void {
	const { id } = req.params;
	const product = productsStore.find(p => p._id === id);

	if (!product) {
		sendError(res, 'Product not found', 404);
		return;
	}

	sendSuccess(res, product);
}

/**
 * POST /api/products
 *
 * Creates a new product listing.
 *
 * Request body: CreateProductInput
 */
export function createProduct(req: Request, res: Response): void {
	const input: CreateProductInput = req.body;

	// Basic validation
	const errors = [];
	if (!input.title) {
		errors.push({ field: 'title', message: 'Title is required' });
	}
	if (!input.price?.amount || input.price.amount <= 0) {
		errors.push({ field: 'price.amount', message: 'Price amount must be greater than 0' });
	}
	if (input.stock === undefined || input.stock < 0) {
		errors.push({ field: 'stock', message: 'Stock must be 0 or greater' });
	}

	if (errors.length > 0) {
		sendError(res, 'Validation failed', 400, errors);
		return;
	}

	const now = new Date();
	const newProduct: Product = {
		_id: generateId(),
		...input,
		createdAt: now,
		updatedAt: now
	};

	productsStore.push(newProduct);
	sendSuccess(res, newProduct, 201, 'Product created successfully');
}

/**
 * PUT /api/products/:id
 *
 * Updates an existing product.
 * Supports partial updates.
 *
 * Request body: UpdateProductInput
 */
export function updateProduct(req: Request, res: Response): void {
	const { id } = req.params;
	const updates: UpdateProductInput = req.body;

	const index = productsStore.findIndex(p => p._id === id);

	if (index === -1) {
		sendError(res, 'Product not found', 404);
		return;
	}

	// Merge updates with existing product
	const updatedProduct: Product = {
		...productsStore[index],
		...updates,
		_id: productsStore[index]._id,
		createdAt: productsStore[index].createdAt,
		updatedAt: new Date()
	};

	productsStore[index] = updatedProduct;
	sendSuccess(res, updatedProduct, 200, 'Product updated successfully');
}

/**
 * DELETE /api/products/:id
 *
 * Deletes a product listing.
 */
export function deleteProduct(req: Request, res: Response): void {
	const { id } = req.params;
	const index = productsStore.findIndex(p => p._id === id);

	if (index === -1) {
		sendError(res, 'Product not found', 404);
		return;
	}

	productsStore.splice(index, 1);
	sendSuccess(res, null, 200, 'Product deleted successfully');
}
