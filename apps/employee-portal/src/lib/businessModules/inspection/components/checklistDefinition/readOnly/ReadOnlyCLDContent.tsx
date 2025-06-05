/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { ApiChecklistDefinitionVersion } from "@eshg/inspection-api";

import { ReadOnlyCLDSection } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/ReadOnlyCLDSection";

interface ReadOnlyCLDContentProps {
  cldVersion: ApiChecklistDefinitionVersion;
  sx?: SxProps;
}

export function ReadOnlyCLDContent({
  cldVersion,
  sx,
}: Readonly<ReadOnlyCLDContentProps>) {
  return (
    <Sheet sx={sx} component="section" aria-label="Checklisten Inhalt">
      <Stack gap={3}>
        {cldVersion.context.sections.map((section, index) => (
          <ReadOnlyCLDSection
            key={section.id}
            section={section}
            sectionIndex={index}
          />
        ))}
      </Stack>
    </Sheet>
  );
}
