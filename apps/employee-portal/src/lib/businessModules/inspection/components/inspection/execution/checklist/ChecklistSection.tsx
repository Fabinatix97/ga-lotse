/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { Fragment, useId } from "react";

import { ApiCLSection } from "@eshg/inspection-api";

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
  const titleId = useId();

  return (
    <Stack spacing={1} sx={{ margin: 2 }} aria-labelledby={titleId}>
      <Typography level="h4" component="h2" color="primary" id={titleId}>
        <Typography component="span" sx={visuallyHidden}>
          Sektion
        </Typography>
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
