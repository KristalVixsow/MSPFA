// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import createAPIValidator from 'lib/server/api/createAPIValidator';

export default createAPIValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			enum: [
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
								messageID: {
									type: 'string'
								}
							},
							required: [
								'messageID'
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
								content: {
									type: 'string',
									minLength: 1,
									maxLength: 20000
								}
							},
							additionalProperties: false
						},
						query: {
							type: 'object',
							properties: {
								messageID: {
									type: 'string'
								}
							},
							required: [
								'messageID'
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