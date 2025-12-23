/**
 * Product Model
 *
 * Defines the Product entity structure and provides in-memory storage.
 * Products are local handicrafts and merchandise for sale.
 */

/**
 * Pricing structure for products.
 */
export interface ProductPricing {
	amount: number;
	originalAmount?: number;
	discount?: number;
}

/**
 * Product specifications (flexible key-value pairs).
 */
export interface ProductSpecifications {
	material?: string;
	dimensions?: string;
	weight?: string;
	careInstructions?: string;
	[key: string]: string | undefined;
}

/**
 * Complete Product entity interface.
 */
export interface Product {
	_id: string;
	title: string;
	description: string;
	category: string;
	subcategory?: string;
	price: ProductPricing;
	stock: number;
	images: string[];
	specifications?: ProductSpecifications;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Input type for creating a new product.
 * Excludes auto-generated fields.
 */
export type CreateProductInput = Omit<Product, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * Input type for updating a product.
 * All fields are optional.
 */
export type UpdateProductInput = Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>;

/**
 * In-memory storage for products.
 * In production, this would be replaced by a database.
 */
export const productsStore: Product[] = [];