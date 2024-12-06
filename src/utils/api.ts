import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { isUndefined } from 'lodash-es';

type ApiResult = { data: unknown } | { error?: FetchBaseQueryError | SerializedError };

// INFO: optional returnType param is to return either the error or message
export const getErrorInApiResult = (result: ApiResult): string | null => {
  if ('error' in result) {
    // TODO: Add i18n translations
    const defaultErrorMessage = 'An error occurred while performing the request.';

    if (isUndefined(result.error)) {
      return defaultErrorMessage;
    }

    if ('message' in result.error) {
      return result.error.message || defaultErrorMessage;
    }

    if ('error' in result.error) {
      return result.error.error || defaultErrorMessage;
    }

    if ('data' in result.error) {
      if (typeof result.error.data === 'string') {
        return result.error.data;
      }

      if (
        result.error.data &&
        typeof result.error.data === 'object' &&
        'error' in result.error.data &&
        'message' in result.error.data &&
        typeof result.error.data.message === 'string' &&
        'error' in result.error.data &&
        typeof result.error.data.error === 'string'
      ) {
        return result.error.data.error ?? result.error.data.message;
      }

      if (
        result.error.data &&
        typeof result.error.data === 'object' &&
        'error' in result.error.data &&
        'message' in result.error.data &&
        typeof result.error.data.message === 'string' &&
        'error' in result.error.data &&
        result.error.data.error !== null &&
        typeof result.error.data.error === 'object'
      ) {
        const validationMessage = Object.entries(result.error.data.error)
          .map(([key, value]) => {
            return `\n${key}: ${value}`;
          })
          .join(', ');

        return `${result.error.data.message}\n${validationMessage}`;
      }

      if (
        result.error.data &&
        typeof result.error.data === 'object' &&
        'message' in result.error.data &&
        typeof result.error.data.message === 'string'
      ) {
        return result.error.data.message || defaultErrorMessage;
      }

      return defaultErrorMessage;
    }
  }

  return null;
};
