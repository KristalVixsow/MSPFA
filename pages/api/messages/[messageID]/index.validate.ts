// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import { createValidator } from 'lib/server/api';

export default createValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			enum: [
				'DELETE',
				'PUT'
			]
		}
	}
}, {
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/Request',
	definitions: {
		'Request': {
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
							$ref: '#/definitions/RecursivePartial%3Calias-731470504-70263-70404-731470504-0-212510%3Cdef-alias--102-405--0-405%2C%22content%22%3E%3E'
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
							const: 'PUT'
						}
					},
					required: [
						'body',
						'method',
						'query'
					]
				}
			]
		},
		'RecursivePartial<alias-731470504-70263-70404-731470504-0-212510<def-alias--102-405--0-405,"content">>': {
			type: 'object',
			properties: {
				content: {
					type: 'string',
					minLength: 1,
					maxLength: 20000
				}
			},
			additionalProperties: false
		}
	}
});