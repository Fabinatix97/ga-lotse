/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Add, ContentPaste, Gesture, Subject } from "@mui/icons-material";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";

export interface SectionButtonBarProps {
  textBlockButtonAction: () => void;
  anamnesisButtonAction: () => void;
  confirmationButtonAction: () => void;
}

export function SectionButtonBar(props: Readonly<SectionButtonBarProps>) {
  return (
    <Stack direction="row" spacing={2}>
      <Button
        data-testid="section-add-textblock-button"
        startDecorator={<Subject />}
        endDecorator={<Add />}
        variant="outlined"
        color="primary"
        onClick={props.textBlockButtonAction}
      >
        Textblock
      </Button>

      <Button
        data-testid="section-add-question-button"
        startDecorator={<ContentPaste />}
        endDecorator={<Add />}
        variant="outlined"
        color="primary"
        onClick={props.anamnesisButtonAction}
      >
        Anamnesefrage
      </Button>

      <Button
        data-testid="section-add-confirmation-button"
        startDecorator={<Gesture />}
        endDecorator={<Add />}
        variant="outlined"
        color="primary"
        onClick={props.confirmationButtonAction}
      >
        Bestätigungsfeld
      </Button>
    </Stack>
  );
}
