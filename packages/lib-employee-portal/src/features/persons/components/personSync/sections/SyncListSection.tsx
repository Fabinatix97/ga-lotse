/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SyncFormField } from "../SyncFormField";
import { DiffArrow, SyncFormBlock, SyncFormSection } from "../SyncFormGrid";

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
            key={`${item}-${index}`}
            label={label}
            value={item}
            visible
          />
        ))}
      </SyncFormBlock>
      <DiffArrow />
      <SyncFormBlock>
        {after?.map((item, index) => (
          <SyncFormField
            key={`${item}-${index}`}
            label={label}
            value={item}
            visible
          />
        ))}
      </SyncFormBlock>
    </SyncFormSection>
  );
}
