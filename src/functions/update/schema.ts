export default {
  type: 'object',
  properties: {
    id: { type: 'number' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    locale: { type: 'string' },
  },
  required: ['id'],
} as const;
