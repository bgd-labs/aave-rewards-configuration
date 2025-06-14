import {advancedInput} from './advancedInput';
import {GenericPrompt} from './types';

function isNumber(value: string) {
  return !isNaN(value as unknown as number);
}

export function transformNumberToHumanReadable(value: string) {
  if (value && isNumber(value)) {
    return new Intl.NumberFormat('en-us').format(BigInt(value));
  }
  return value;
}

export function transformNumberInDaysToHumanReadable(value: string) {
  if (value && isNumber(value)) {
    return new Intl.NumberFormat('en-us').format(BigInt(value)) + ' days';
  }
  return value;
}

export async function numberPrompt({message, required}: GenericPrompt, opts?) {
  return await advancedInput(
    {
      message,
      transformer: transformNumberToHumanReadable,
      validate: (v) => {
        if (required && v.length == 0) return false;
        return isNumber(v);
      },
      pattern: /^[0-9]*$/,
      patternError: 'Only full numbers are allowed',
    },
    opts
  );
}

export async function numberPromptNoTransform({message, required}: GenericPrompt, opts?) {
  return await advancedInput(
    {
      message,
      transformer: undefined,
      validate: (v) => {
        if (required && v.length == 0) return false;
        return isNumber(v);
      },
      pattern: /^[0-9]*$/,
      patternError: 'Only full numbers are allowed',
    },
    opts
  );
}

export async function numberPromptInDays({message, required}: GenericPrompt, opts?) {
  return await advancedInput(
    {
      message,
      transformer: transformNumberInDaysToHumanReadable,
      validate: (v) => {
        if (required && v.length == 0) return false;
        return isNumber(v);
      },
      pattern: /^[0-9]*$/,
      patternError: 'Only full numbers are allowed',
    },
    opts
  );
}

export function translateJsNumberToSol(value?: string) {
  if (!value) return `EngineFlags.KEEP_CURRENT`;
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '_');
}
