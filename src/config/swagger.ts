/**
 * Swagger/OpenAPI Configuration
 *
 * Defines the OpenAPI specification for the JharkhandYatra API.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'JharkhandYatra API',
			version,
			description: `
REST API for the JharkhandYatra tourism platform.

## Features
- **Homestays**: Browse and book authentic local accommodations
- **Guides**: Connect with certified local tour guides
- **Products**: Explore traditional handicrafts and merchandise
- **Bookings**: Manage reservations for homestays and guides
- **Search**: Unified search across all entities

## Authentication
Protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

Obtain a token by registering and logging in via the /auth endpoints.
      `,
			contact: {
				name: 'JharkhandYatra Team',
				email: 'support@jharkhandyatra.com'
			},
			license: {
				name: 'Apache 2.0',
				url: 'https://www.apache.org/licenses/LICENSE-2.0'
			}
		},
		servers: [
			{
				url: '/api/v1',
				description: 'API v1'
			}
		],
		tags: [
			{ name: 'Health', description: 'Health check endpoints' },
			{ name: 'Auth', description: 'Authentication endpoints' },
			{ name: 'Homestays', description: 'Homestay management' },
			{ name: 'Guides', description: 'Tour guide management' },
			{ name: 'Products', description: 'Product catalog' },
			{ name: 'Bookings', description: 'Booking management' },
			{ name: 'Search', description: 'Unified search' }
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'JWT token obtained from /auth/login'
				}
			},
			schemas: {
				// Common schemas
				ApiResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean' },
						message: { type: 'string' },
						data: { type: 'object' }
					}
				},
				ApiError: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: false },
						message: { type: 'string' },
						errors: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									field: { type: 'string' },
									message: { type: 'string' }
								}
							}
						}
					}
				},
				PaginationMeta: {
					type: 'object',
					properties: {
						currentPage: { type: 'integer', example: 1 },
						totalPages: { type: 'integer', example: 5 },
						totalResults: { type: 'integer', example: 50 },
						limit: { type: 'integer', example: 10 }
					}
				},

				// User schemas
				User: {
					type: 'object',
					properties: {
						id: { type: 'string', example: '507f1f77bcf86cd799439011' },
						email: { type: 'string', format: 'email', example: 'user@example.com' },
						name: { type: 'string', example: 'John Doe' },
						role: { type: 'string', enum: ['admin', 'host', 'guide', 'customer'], example: 'customer' },
						isActive: { type: 'boolean', example: true },
						createdAt: { type: 'string', format: 'date-time' }
					}
				},
				RegisterInput: {
					type: 'object',
					required: ['email', 'password', 'name'],
					properties: {
						email: { type: 'string', format: 'email', example: 'newuser@example.com' },
						password: { type: 'string', minLength: 8, example: 'SecurePass123!' },
						name: { type: 'string', example: 'Jane Doe' },
						role: { type: 'string', enum: ['host', 'guide', 'customer'], example: 'customer' }
					}
				},
				LoginInput: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: { type: 'string', format: 'email', example: 'user@example.com' },
						password: { type: 'string', example: 'SecurePass123!' }
					}
				},
				AuthResponse: {
					type: 'object',
					properties: {
						success: { type: 'boolean', example: true },
						data: {
							type: 'object',
							properties: {
								user: { $ref: '#/components/schemas/User' },
								token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
							}
						}
					}
				},

				// Homestay schemas
				Homestay: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						name: { type: 'string', example: 'Tribal Heritage Homestay' },
						description: { type: 'string' },
						hostName: { type: 'string', example: 'Ravi Kumar' },
						location: {
							type: 'object',
							properties: {
								address: { type: 'string' },
								city: { type: 'string', example: 'Ranchi' },
								state: { type: 'string', example: 'Jharkhand' },
								pincode: { type: 'string', example: '834001' },
								coordinates: {
									type: 'object',
									properties: {
										latitude: { type: 'number', example: 23.3441 },
										longitude: { type: 'number', example: 85.3096 }
									}
								}
							}
						},
						pricePerNight: { type: 'number', example: 1500 },
						maxGuests: { type: 'integer', example: 6 },
						amenities: { type: 'array', items: { type: 'string' } },
						images: { type: 'array', items: { type: 'string', format: 'uri' } },
						rating: { type: 'number', example: 4.5 },
						isVerified: { type: 'boolean' },
						isActive: { type: 'boolean' }
					}
				},
				CreateHomestay: {
					type: 'object',
					required: ['name', 'description', 'hostName', 'location', 'pricePerNight', 'maxGuests'],
					properties: {
						name: { type: 'string', minLength: 3, maxLength: 100 },
						description: { type: 'string', minLength: 10, maxLength: 2000 },
						hostName: { type: 'string', minLength: 2, maxLength: 100 },
						location: {
							type: 'object',
							required: ['address', 'city', 'state', 'pincode'],
							properties: {
								address: { type: 'string' },
								city: { type: 'string' },
								state: { type: 'string' },
								pincode: { type: 'string', pattern: '^[0-9]{6}$' },
								coordinates: {
									type: 'object',
									properties: {
										latitude: { type: 'number', minimum: -90, maximum: 90 },
										longitude: { type: 'number', minimum: -180, maximum: 180 }
									}
								}
							}
						},
						pricePerNight: { type: 'number', minimum: 0 },
						maxGuests: { type: 'integer', minimum: 1, maximum: 50 },
						amenities: { type: 'array', items: { type: 'string' } },
						images: { type: 'array', items: { type: 'string', format: 'uri' } }
					}
				},

				// Guide schemas
				Guide: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						name: { type: 'string', example: 'Suresh Mahato' },
						bio: { type: 'string' },
						languages: { type: 'array', items: { type: 'string' }, example: ['Hindi', 'English', 'Santhali'] },
						specializations: { type: 'array', items: { type: 'string' }, example: ['Tribal Culture', 'Wildlife'] },
						experience: { type: 'integer', example: 8 },
						pricePerDay: { type: 'number', example: 2000 },
						contactNumber: { type: 'string' },
						email: { type: 'string', format: 'email' },
						rating: { type: 'number', example: 4.8 },
						isVerified: { type: 'boolean' },
						isAvailable: { type: 'boolean' }
					}
				},

				// Product schemas
				Product: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						name: { type: 'string', example: 'Dokra Art Elephant' },
						description: { type: 'string' },
						category: { type: 'string', example: 'handicraft' },
						price: { type: 'number', example: 1200 },
						images: { type: 'array', items: { type: 'string', format: 'uri' } },
						artisan: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								village: { type: 'string' }
							}
						},
						inStock: { type: 'boolean' },
						stockQuantity: { type: 'integer' }
					}
				},

				// Booking schemas
				Booking: {
					type: 'object',
					properties: {
						_id: { type: 'string' },
						bookingType: { type: 'string', enum: ['homestay', 'guide'] },
						userId: { type: 'string' },
						resourceId: { type: 'string' },
						startDate: { type: 'string', format: 'date' },
						endDate: { type: 'string', format: 'date' },
						guests: { type: 'integer' },
						totalPrice: { type: 'number' },
						status: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] },
						contactInfo: {
							type: 'object',
							properties: {
								name: { type: 'string' },
								email: { type: 'string', format: 'email' },
								phone: { type: 'string' }
							}
						}
					}
				},
				CreateBooking: {
					type: 'object',
					required: ['bookingType', 'resourceId', 'startDate', 'endDate', 'contactInfo'],
					properties: {
						bookingType: { type: 'string', enum: ['homestay', 'guide'] },
						resourceId: { type: 'string', description: 'ID of the homestay or guide' },
						startDate: { type: 'string', format: 'date' },
						endDate: { type: 'string', format: 'date' },
						guests: { type: 'integer', minimum: 1 },
						specialRequests: { type: 'string' },
						contactInfo: {
							type: 'object',
							required: ['name', 'email', 'phone'],
							properties: {
								name: { type: 'string' },
								email: { type: 'string', format: 'email' },
								phone: { type: 'string' }
							}
						}
					}
				}
			},
			responses: {
				BadRequest: {
					description: 'Bad Request - Invalid input',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/ApiError' }
						}
					}
				},
				Unauthorized: {
					description: 'Unauthorized - Authentication required',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/ApiError' },
							example: { success: false, message: 'Authentication required' }
						}
					}
				},
				Forbidden: {
					description: 'Forbidden - Insufficient permissions',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/ApiError' },
							example: { success: false, message: 'Access denied' }
						}
					}
				},
				NotFound: {
					description: 'Resource not found',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/ApiError' },
							example: { success: false, message: 'Resource not found' }
						}
					}
				}
			}
		},
		paths: {
			'/health': {
				get: {
					tags: ['Health'],
					summary: 'Health check',
					description: 'Returns server health status',
					responses: {
						'200': {
							description: 'Server is healthy',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean', example: true },
											data: {
												type: 'object',
												properties: {
													status: { type: 'string', example: 'healthy' },
													timestamp: { type: 'string', format: 'date-time' },
													uptime: { type: 'number' }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			'/auth/register': {
				post: {
					tags: ['Auth'],
					summary: 'Register new user',
					description: 'Create a new user account',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/RegisterInput' }
							}
						}
					},
					responses: {
						'201': {
							description: 'User registered successfully',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/AuthResponse' }
								}
							}
						},
						'400': { $ref: '#/components/responses/BadRequest' },
						'409': {
							description: 'Email already exists',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ApiError' }
								}
							}
						}
					}
				}
			},
			'/auth/login': {
				post: {
					tags: ['Auth'],
					summary: 'User login',
					description: 'Authenticate user and receive JWT token',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/LoginInput' }
							}
						}
					},
					responses: {
						'200': {
							description: 'Login successful',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/AuthResponse' }
								}
							}
						},
						'401': {
							description: 'Invalid credentials',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ApiError' }
								}
							}
						}
					}
				}
			},
			'/auth/me': {
				get: {
					tags: ['Auth'],
					summary: 'Get current user',
					description: 'Get the currently authenticated user profile',
					security: [{ bearerAuth: [] }],
					responses: {
						'200': {
							description: 'User profile',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean', example: true },
											data: { $ref: '#/components/schemas/User' }
										}
									}
								}
							}
						},
						'401': { $ref: '#/components/responses/Unauthorized' }
					}
				}
			},
			'/homestays': {
				get: {
					tags: ['Homestays'],
					summary: 'List all homestays',
					description: 'Get paginated list of homestays with optional filters',
					parameters: [
						{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
						{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 100 } },
						{ name: 'city', in: 'query', schema: { type: 'string' } },
						{ name: 'minPrice', in: 'query', schema: { type: 'number' } },
						{ name: 'maxPrice', in: 'query', schema: { type: 'number' } }
					],
					responses: {
						'200': {
							description: 'List of homestays',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'array',
												items: { $ref: '#/components/schemas/Homestay' }
											},
											pagination: { $ref: '#/components/schemas/PaginationMeta' }
										}
									}
								}
							}
						}
					}
				},
				post: {
					tags: ['Homestays'],
					summary: 'Create homestay',
					description: 'Create a new homestay listing (requires host or admin role)',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CreateHomestay' }
							}
						}
					},
					responses: {
						'201': {
							description: 'Homestay created',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: { $ref: '#/components/schemas/Homestay' }
										}
									}
								}
							}
						},
						'400': { $ref: '#/components/responses/BadRequest' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' }
					}
				}
			},
			'/homestays/{id}': {
				get: {
					tags: ['Homestays'],
					summary: 'Get homestay by ID',
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': {
							description: 'Homestay details',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: { $ref: '#/components/schemas/Homestay' }
										}
									}
								}
							}
						},
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				put: {
					tags: ['Homestays'],
					summary: 'Update homestay',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CreateHomestay' }
							}
						}
					},
					responses: {
						'200': { description: 'Homestay updated' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				delete: {
					tags: ['Homestays'],
					summary: 'Delete homestay',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Homestay deleted' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				}
			},
			'/guides': {
				get: {
					tags: ['Guides'],
					summary: 'List all guides',
					parameters: [
						{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
						{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
						{ name: 'language', in: 'query', schema: { type: 'string' } },
						{ name: 'specialization', in: 'query', schema: { type: 'string' } }
					],
					responses: {
						'200': {
							description: 'List of guides',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'array',
												items: { $ref: '#/components/schemas/Guide' }
											},
											pagination: { $ref: '#/components/schemas/PaginationMeta' }
										}
									}
								}
							}
						}
					}
				},
				post: {
					tags: ['Guides'],
					summary: 'Create guide profile',
					security: [{ bearerAuth: [] }],
					responses: {
						'201': { description: 'Guide created' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' }
					}
				}
			},
			'/guides/{id}': {
				get: {
					tags: ['Guides'],
					summary: 'Get guide by ID',
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Guide details' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				put: {
					tags: ['Guides'],
					summary: 'Update guide',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Guide updated' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				delete: {
					tags: ['Guides'],
					summary: 'Delete guide',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Guide deleted' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				}
			},
			'/products': {
				get: {
					tags: ['Products'],
					summary: 'List all products',
					parameters: [
						{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
						{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
						{ name: 'category', in: 'query', schema: { type: 'string' } }
					],
					responses: {
						'200': {
							description: 'List of products',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'array',
												items: { $ref: '#/components/schemas/Product' }
											},
											pagination: { $ref: '#/components/schemas/PaginationMeta' }
										}
									}
								}
							}
						}
					}
				},
				post: {
					tags: ['Products'],
					summary: 'Create product',
					security: [{ bearerAuth: [] }],
					responses: {
						'201': { description: 'Product created' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' }
					}
				}
			},
			'/products/{id}': {
				get: {
					tags: ['Products'],
					summary: 'Get product by ID',
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Product details' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				put: {
					tags: ['Products'],
					summary: 'Update product',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Product updated' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				},
				delete: {
					tags: ['Products'],
					summary: 'Delete product',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Product deleted' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				}
			},
			'/bookings': {
				get: {
					tags: ['Bookings'],
					summary: 'List bookings',
					description: 'Get user bookings (customers see own, hosts/guides see relevant)',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
						{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
						{ name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'] } }
					],
					responses: {
						'200': {
							description: 'List of bookings',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'array',
												items: { $ref: '#/components/schemas/Booking' }
											},
											pagination: { $ref: '#/components/schemas/PaginationMeta' }
										}
									}
								}
							}
						},
						'401': { $ref: '#/components/responses/Unauthorized' }
					}
				},
				post: {
					tags: ['Bookings'],
					summary: 'Create booking',
					description: 'Create a new booking for homestay or guide',
					security: [{ bearerAuth: [] }],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/CreateBooking' }
							}
						}
					},
					responses: {
						'201': {
							description: 'Booking created',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: { $ref: '#/components/schemas/Booking' }
										}
									}
								}
							}
						},
						'400': { $ref: '#/components/responses/BadRequest' },
						'401': { $ref: '#/components/responses/Unauthorized' }
					}
				}
			},
			'/bookings/{id}': {
				get: {
					tags: ['Bookings'],
					summary: 'Get booking by ID',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					responses: {
						'200': { description: 'Booking details' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				}
			},
			'/bookings/{id}/cancel': {
				put: {
					tags: ['Bookings'],
					summary: 'Cancel booking',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }
					],
					requestBody: {
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										reason: { type: 'string' }
									}
								}
							}
						}
					},
					responses: {
						'200': { description: 'Booking cancelled' },
						'401': { $ref: '#/components/responses/Unauthorized' },
						'403': { $ref: '#/components/responses/Forbidden' },
						'404': { $ref: '#/components/responses/NotFound' }
					}
				}
			},
			'/search': {
				get: {
					tags: ['Search'],
					summary: 'Unified search',
					description: 'Search across homestays, guides, and products',
					parameters: [
						{ name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search query' },
						{ name: 'type', in: 'query', schema: { type: 'string', enum: ['homestay', 'guide', 'product'] } },
						{ name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
						{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }
					],
					responses: {
						'200': {
							description: 'Search results',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'object',
												properties: {
													homestays: { type: 'array', items: { $ref: '#/components/schemas/Homestay' } },
													guides: { type: 'array', items: { $ref: '#/components/schemas/Guide' } },
													products: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			'/search/autocomplete': {
				get: {
					tags: ['Search'],
					summary: 'Autocomplete suggestions',
					parameters: [
						{ name: 'q', in: 'query', required: true, schema: { type: 'string', minLength: 2 } }
					],
					responses: {
						'200': {
							description: 'Autocomplete suggestions',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											success: { type: 'boolean' },
											data: {
												type: 'array',
												items: {
													type: 'object',
													properties: {
														text: { type: 'string' },
														type: { type: 'string' }
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},
	apis: [] // We define everything inline above
};

export const swaggerSpec = swaggerJsdoc(options);
