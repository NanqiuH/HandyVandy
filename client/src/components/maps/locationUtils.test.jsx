import { getLocationName } from './locationUtils';

global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

test('returns location name on successful API response', async () => {
  const mockResponse = {
    status: "OK",
    results: [{ formatted_address: "123 Main St, Anytown, USA" }]
  };
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse)
  });

  const locationName = await getLocationName(40.7128, -74.0060);
  expect(locationName).toBe("123 Main St, Anytown, USA");
});

test('throws error when API response has no results', async () => {
  const mockResponse = {
    status: "OK",
    results: []
  };
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse)
  });

  await expect(getLocationName(40.7128, -74.0060)).rejects.toThrow("Failed to get location name");
});

test('throws error when API response status is not OK', async () => {
  const mockResponse = {
    status: "ZERO_RESULTS",
    results: []
  };
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse)
  });

  await expect(getLocationName(40.7128, -74.0060)).rejects.toThrow("Failed to get location name");
});

test('throws error with error message from API response', async () => {
  const mockResponse = {
    status: "REQUEST_DENIED",
    error_message: "Invalid API key"
  };
  fetch.mockResolvedValueOnce({
    json: jest.fn().mockResolvedValueOnce(mockResponse)
  });

  await expect(getLocationName(40.7128, -74.0060)).rejects.toThrow("Invalid API key");
});