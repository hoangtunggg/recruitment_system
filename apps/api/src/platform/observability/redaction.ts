const sensitiveKeys = /password|token|authorization|cookie|secret|otp|recovery/i;

export function redactSensitiveData(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        sensitiveKeys.test(key) ? '[REDACTED]' : redactSensitiveData(nested),
      ]),
    );
  }
  return value;
}
