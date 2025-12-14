export const authAPI = {
  register: jest.fn(),
  login: jest.fn(),
  getProfile: jest.fn(),
};

export const sweetsAPI = {
  getAll: jest.fn(),
  search: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  purchase: jest.fn(),
  restock: jest.fn(),
};