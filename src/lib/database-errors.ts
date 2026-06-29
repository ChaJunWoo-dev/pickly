export const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';

export const hasErrorCode = (error: unknown, code: string) => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
};
