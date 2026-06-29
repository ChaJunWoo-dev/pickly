type LogMetadata = Record<string, unknown>;

const isDevelopment = typeof __DEV__ !== 'undefined' && __DEV__;

const formatMetadata = (metadata?: LogMetadata) => {
  if (!metadata) return undefined;

  return metadata;
};

export const logger = {
  warn: (message: string, metadata?: LogMetadata) => {
    if (!isDevelopment) return;

    console.warn(message, formatMetadata(metadata));
  },
};
