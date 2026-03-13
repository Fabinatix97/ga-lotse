/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from "react";

export function useValidateEquipmentSelector() {
  return useMemo(
    () => (value: string) => {
      if (!value) return undefined;
      if (!/^[A-Z0-9]{4}$/.test(value)) {
        return "Die Gerätekennung muss genau 4 Zeichen lang sein (Ziffern und Großbuchstaben).";
      }
      return undefined;
    },
    [],
  );
}
