/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export interface NoteFormValues {
  note: OptionalFieldValue<string>;
}

export function NoteFormSection() {
  return (
    <InformationSheet>
      <InputField type="text" label="Bemerkung" name="note" />
    </InformationSheet>
  );
}
