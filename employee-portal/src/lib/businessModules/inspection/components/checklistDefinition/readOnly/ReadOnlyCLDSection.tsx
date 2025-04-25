/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

import { ApiCLSectionContext } from "@eshg/inspection-api";

import { ReadOnlyCLDElement } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";

interface ReadOnlyCLDSectionProps {
  section: ApiCLSectionContext;
  sectionIndex: number;
}

export function ReadOnlyCLDSection({
  section,
  sectionIndex,
}: Readonly<ReadOnlyCLDSectionProps>) {
  const sectionTitle = `${sectionIndex + 1}. ${section.title}`;
  return (
    <Stack gap={3} role="region" aria-label={`Sektion ${sectionIndex + 1}`}>
      <Typography level="title-lg" component="label" color="primary">
        {sectionTitle}
      </Typography>
      <Stack gap={3} sx={{ ml: 2 }}>
        {section.elements.map((element, index) => (
          <ReadOnlyCLDElement
            element={element}
            sectionIndex={sectionIndex}
            elementIndex={index}
            key={element.id}
          />
        ))}
      </Stack>
    </Stack>
  );
}
