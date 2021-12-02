// This file is automatically generated by `scripts/generate-validators`. Do not edit directly.

import createAPIValidator from 'lib/server/api/createAPIValidator';

export default createAPIValidator({
	$schema: 'http://json-schema.org/draft-07/schema#',
	$ref: '#/definitions/RequestMethod',
	definitions: {
		RequestMethod: {
			type: 'string',
			enum: [
				'PATCH',
				'DELETE',
				'GET'
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
						body: {
							type: 'object',
							additionalProperties: {
								anyOf: [
									{
										type: 'object',
										additionalProperties: false,
										properties: {
											published: {
												anyOf: [
													{
														$ref: '#/definitions/DateNumber'
													},
													{
														type: 'null'
													}
												]
											},
											id: {
												$ref: '#/definitions/StoryPageID'
											},
											title: {
												type: 'string',
												maxLength: 500
											},
											content: {
												type: 'string'
											},
											nextPages: {
												type: 'array',
												items: {
													$ref: '#/definitions/StoryPageID'
												}
											},
											unlisted: {
												type: 'boolean'
											},
											disableControls: {
												type: 'boolean',
												description: 'Whether the client\'s controls should be disabled while this page is rendered.'
											},
											commentary: {
												type: 'string'
											},
											silent: {
												type: 'boolean',
												description: 'If true, publishing the page should neither cause notifications nor change the story\'s `updated` value.'
											}
										},
										required: [
											'commentary',
											'content',
											'disableControls',
											'id',
											'nextPages',
											'silent',
											'title',
											'unlisted'
										]
									},
									{
										type: 'object',
										additionalProperties: false,
										properties: {
											published: {
												anyOf: [
													{
														$ref: '#/definitions/DateNumber'
													},
													{
														type: 'null'
													}
												]
											},
											title: {
												type: 'string',
												maxLength: 500
											},
											content: {
												type: 'string'
											},
											nextPages: {
												type: 'array',
												items: {
													$ref: '#/definitions/StoryPageID'
												}
											},
											unlisted: {
												type: 'boolean'
											},
											disableControls: {
												type: 'boolean',
												description: 'Whether the client\'s controls should be disabled while this page is rendered.'
											},
											commentary: {
												type: 'string'
											},
											silent: {
												type: 'boolean',
												description: 'If true, publishing the page should neither cause notifications nor change the story\'s `updated` value.'
											}
										}
									}
								]
							},
							description: 'A record of `ClientStoryPage`s (some of which are partial) to add or change.'
						},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								}
							},
							required: [
								'storyID'
							]
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
				},
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						body: {
							type: 'object',
							properties: {
								pageIDs: {
									type: 'array',
									items: {
										$ref: '#/definitions/StoryPageID'
									},
									description: 'The IDs of pages to delete.',
									uniqueItems: true
								}
							},
							required: [
								'pageIDs'
							],
							additionalProperties: false
						},
						query: {
							type: 'object',
							properties: {
								storyID: {
									type: 'string'
								}
							},
							required: [
								'storyID'
							]
						},
						method: {
							type: 'string',
							const: 'DELETE'
						}
					},
					required: [
						'body',
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
								}
							},
							required: [
								'storyID'
							]
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
				}
			]
		},
		DateNumber: {
			$ref: '#/definitions/integer',
			minimum: -8640000000000000,
			maximum: 8640000000000000
		},
		integer: {
			type: 'integer'
		},
		StoryPageID: {
			$ref: '#/definitions/integer',
			minimum: 1
		}
	}
});