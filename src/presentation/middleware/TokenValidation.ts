export const validateToken = async (token: string): Promise<void> => {
  if (!token) {
    throw new Error('Authorization token is required');
  }
};
