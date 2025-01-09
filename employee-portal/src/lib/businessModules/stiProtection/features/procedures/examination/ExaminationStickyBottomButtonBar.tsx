/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { Button } from "@mui/joy";

import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

interface ExaminationStickyBottomButtonBarProps {
  isSubmitting: boolean;
  onClick: () => void;
}

export function ExaminationStickyBottomButtonBar(
  props: ExaminationStickyBottomButtonBarProps,
) {
  const { isSubmitting, onClick } = props;

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <Button variant="plain" onClick={onClick}>
            Abbrechen
          </Button>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
