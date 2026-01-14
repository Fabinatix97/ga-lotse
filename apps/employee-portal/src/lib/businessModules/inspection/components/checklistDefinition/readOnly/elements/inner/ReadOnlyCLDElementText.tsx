/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Card } from "@mui/joy";

import { ApiCLTextElementContext } from "@eshg/inspection-api";

import { ReadOnlyCLDElementProps } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";
import { ReadOnlyCLDElementWrapper } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementWrapper";

export function ReadOnlyCLDElementText(
  props: Readonly<ReadOnlyCLDElementProps<ApiCLTextElementContext>>,
) {
  // use a Card to make something that looks like a text input
  return (
    <ReadOnlyCLDElementWrapper {...props}>
      <Card sx={{ height: "4rem" }} />
    </ReadOnlyCLDElementWrapper>
  );
}
