/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isPlainObject } from "remeda";

export function createFormData(
  files: {
    name: string;
    data: Record<string, unknown> | File;
    filename: string;
  }[],
): FormData {
  const formData = new FormData();
  files.forEach(({ name, data, filename }) => {
    if (isPlainObject(data)) {
      const blob = new Blob([JSON.stringify(data)], {
        type: "application/json",
      });
      formData.append(name, blob, filename);
    } else {
      formData.append(name, data, data.name);
    }
  });
  return formData;
}
