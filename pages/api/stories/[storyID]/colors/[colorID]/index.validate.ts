// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import { createValidator } from 'lib/server/api';

export default createValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			enum: [
				'GET',
				'DELETE',
				'PATCH'
			]
		}
	}
}, {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/Request',
	definitions: {
		Request: {
			anyOf: [
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								},
								colorID: {
									type: 'string'
								}
							},
							required: [
								'storyID',
								'colorID'
							],
							additionalProperties: false
						},
						method: {
							type: 'string',
							const: 'GET'
						}
					},
					required: [
						'method',
						'query'
					]
				},
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								},
								colorID: {
									type: 'string'
								}
							},
							required: [
								'storyID',
								'colorID'
							],
							additionalProperties: false
						},
						method: {
							type: 'string',
							const: 'DELETE'
						}
					},
					required: [
						'method',
						'query'
					]
				},
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {
							type: 'object',
							properties: {
								name: {
									type: 'string'
								},
								value: {
									type: 'string'
								},
								group: {
									type: [
										'string',
										'null'
									],
									description: 'The ID of the color group which the color should be set into, or `null` if the color should be removed from any group.'
								}
							},
							additionalProperties: false
						},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								},
								colorID: {
									type: 'string'
								}
							},
							required: [
								'storyID',
								'colorID'
							],
							additionalProperties: false
						},
						method: {
							type: 'string',
							const: 'PATCH'
						}
					},
					required: [
						'body',
						'method',
						'query'
					]
				}
			]
		}
	}
});