/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

export type UseCreateInboxProcedure = (
  inboxProcedureId: string,
) => (() => void) | undefined;

export function useCreateInboxProcedureDisabled() {
  return undefined;
}
