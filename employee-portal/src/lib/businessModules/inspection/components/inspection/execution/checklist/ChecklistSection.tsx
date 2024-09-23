/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCLSection } from "@eshg/employee-portal-api/inspection";
import { Divider, Stack, Typography } from "@mui/joy";
import { Fragment } from "react";

import { ChecklistSectionElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/ChecklistSectionElement";
import { mapToCLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

interface ChecklistSectionProps {
  inspectionExternalId: string;
  checklistId: string;
  section: ApiCLSection;
  sectionIndex: number;
  readOnly?: boolean;
}

export function ChecklistSection({
  inspectionExternalId,
  checklistId,
  section,
  sectionIndex,
  readOnly,
}: Readonly<ChecklistSectionProps>) {
  return (
    <Stack spacing={1} sx={{ margin: 2 }} aria-label={section.context.title}>
      <Typography level="h4" component="p" color="primary">
        {`${sectionIndex + 1}. ${section.context.title}`}
      </Typography>
      {section.elements.map((element, elementIndex) => {
        return ["SEPARATOR", "CLSeparatorElement"].includes(element.type) ? (
          <Divider key={element.context.id} />
        ) : (
          <Fragment key={element.context.id}>
            <ChecklistSectionElement
              inspectionExternalId={inspectionExternalId}
              checklistId={checklistId}
              element={mapToCLFormElement(element)}
              sectionIndex={sectionIndex}
              elementIndex={elementIndex}
              readOnly={readOnly}
            />
          </Fragment>
        );
      })}
    </Stack>
  );
}
