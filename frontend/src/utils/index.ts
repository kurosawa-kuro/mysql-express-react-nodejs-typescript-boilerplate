export const setErrorFromException = (
  error: unknown,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (error instanceof Error) {
    setError(error.message);
  }
};
