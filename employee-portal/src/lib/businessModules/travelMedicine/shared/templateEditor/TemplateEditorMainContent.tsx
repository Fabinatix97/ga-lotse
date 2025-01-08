/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiTemplateSection } from "@eshg/employee-portal-api/travelMedicine";
import { Box, Sheet } from "@mui/joy";
import { ReactNode } from "react";

import { TemplateSectionList } from "@/lib/businessModules/travelMedicine/shared/templateEditor/sections/TemplateSectionList";

export function TemplateEditorMainContent(
  props: Readonly<{
    sections: ApiTemplateSection[];
    headSection: ReactNode;
  }>,
) {
  return (
    <Box>
      <Sheet>{props.headSection}</Sheet>
      <TemplateSectionList sections={props.sections} />
    </Box>
  );
}
