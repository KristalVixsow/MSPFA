// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import createAPIValidator from 'lib/server/api/createAPIValidator';

export default createAPIValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			const: 'POST'
		}
	}
}, {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/Request',
	definitions: {
		Request: {
			type: 'object',
			additionalProperties: false,
			properties: {
				body: {
					type: 'object',
					properties: {
						content: {
							type: 'string',
							minLength: 1,
							maxLength: 2000
						}
					},
					required: [
						'content'
					],
					additionalProperties: false
				},
				query: {
					type: 'object',
					properties: {
						storyID: {
							type: 'string'
						},
						pageID: {
							type: 'string'
						}
					},
					required: [
						'storyID',
						'pageID'
					],
					additionalProperties: false
				},
				method: {
					type: 'string',
					const: 'POST'
				}
			},
			required: [
				'body',
				'method',
				'query'
			]
		}
	}
});