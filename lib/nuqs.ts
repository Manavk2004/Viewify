import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

/**
 * Central place to define & type your URL search params.
 *
 * Add keys here as your app grows, and use the exported hooks anywhere
 * in client components.
 */
export const queryParamParsers = {
  /** Generic free-text search */
  q: parseAsString.withDefault(""),

  /** Example: pagination */
  page: parseAsInteger.withDefault(1),

  /** Example: UI state */
  sidebarOpen: parseAsBoolean.withDefault(true),
};

/** Use a single query key */
export function useAppQueryState<K extends keyof typeof queryParamParsers>(
  key: K,
) {
  return useQueryState(key, queryParamParsers[key]);
}

/** Use all app query params at once */
export function useAppQueryStates() {
  return useQueryStates(queryParamParsers);
}

