/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InformationSheet } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

export function NoteFormSection() {
  return (
    <InformationSheet>
      <InputField type="text" label="Bemerkung" name="note" />
    </InformationSheet>
  );
}
