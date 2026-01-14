/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UploadFileOutlined } from "@mui/icons-material";
import { Button } from "@mui/joy";

import { ApiCLAudioContext, ApiCLImageContext } from "@eshg/inspection-api";

import { ReadOnlyCLDElementProps } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/ReadOnlyCLDElement";
import { ReadOnlyCLDElementWrapper } from "@/lib/businessModules/inspection/components/checklistDefinition/readOnly/elements/inner/ReadOnlyCLDElementWrapper";

type ApiCLFileContext = ApiCLImageContext | ApiCLAudioContext;

export function ReadOnlyCLDElementFile({
  element,
  ...props
}: Readonly<ReadOnlyCLDElementProps<ApiCLFileContext>>) {
  const buttonLabel = getButtonLabel(element);

  return (
    <ReadOnlyCLDElementWrapper element={element} {...props}>
      <div>
        <Button
          disabled
          variant="outlined"
          startDecorator={<UploadFileOutlined />}
          aria-hidden="true"
        >
          {buttonLabel}
        </Button>
      </div>
    </ReadOnlyCLDElementWrapper>
  );
}

function getButtonLabel(element: ApiCLFileContext) {
  switch (element.type) {
    case "AUDIO":
      return "Audio hochladen";
    case "IMAGE":
      return "Bild hochladen";
  }
}
