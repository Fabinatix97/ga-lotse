/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SyncFormField } from "@/lib/shared/components/centralFile/sync/SyncFormField";
import {
  DiffArrow,
  SyncFormBlock,
  SyncFormSection,
} from "@/lib/shared/components/centralFile/sync/SyncFormGrid";

export function SyncListSection({
  before,
  after,
  label,
}: {
  label: string;
  before: string[] | undefined;
  after: string[] | undefined;
}) {
  return (
    <SyncFormSection>
      <SyncFormBlock>
        {before?.map((item, index) => (
          <SyncFormField
            label={label}
            value={item}
            key={`${item}-${index}`}
            visible
          />
        ))}
      </SyncFormBlock>
      <DiffArrow />
      <SyncFormBlock>
        {after?.map((item, index) => (
          <SyncFormField
            label={label}
            value={item}
            key={`${item}-${index}`}
            visible
          />
        ))}
      </SyncFormBlock>
    </SyncFormSection>
  );
}
