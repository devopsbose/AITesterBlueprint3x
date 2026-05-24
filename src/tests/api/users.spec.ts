import { test, expect } from '@playwright/test';
import { APIClient } from '@api/APIClient';
import { BaseAPITest } from '@api/BaseAPITest';

test.describe('API Testing - User Endpoints', () => {
  let apiClient: APIClient;
  let baseAPITest: BaseAPITest;

  test.beforeEach(async () => {
    apiClient = new APIClient();
    baseAPITest = new BaseAPITest();
  });

  test('should fetch users successfully', async () => {
    const response = await apiClient.get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
  });

  test('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    const response = await apiClient.post('/users', userData);

    expect(response.status).toBe(201);
    expect(baseAPITest.verifyResponseField(response.data, 'id')).toBeTruthy();
    expect(baseAPITest.verifyResponseField(response.data, 'email')).toBeTruthy();
  });

  test('should update user successfully', async () => {
    const userId = '123';
    const updateData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    const response = await apiClient.put(`/users/${userId}`, updateData);

    expect(response.status).toBe(200);
    expect(baseAPITest.verifyResponseField(response.data, 'name')).toBeTruthy();
  });

  test('should delete user successfully', async () => {
    const userId = '123';
    const response = await apiClient.delete(`/users/${userId}`);

    expect(response.status).toBe(204);
  });

  test('should handle 404 error', async () => {
    try {
      await apiClient.get('/users/nonexistent');
    } catch (error: unknown) {
      const axiosError = error as { response: { status: number } };
      expect(axiosError.response.status).toBe(404);
    }
  });
});
