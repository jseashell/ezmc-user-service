export default {
  type: 'object',
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    locale: { type: 'string' },
  },
  required: ['username', 'email'],
} as const;
