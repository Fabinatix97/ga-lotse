/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BottomToolbar, ButtonBar } from "@eshg/lib-employee-portal";
import { InternalLinkButton, SubmitButton } from "@eshg/lib-portal";

import { StickyBottomBox } from "@/lib/shared/components/layout/StickyBottomBox";

export function TemplateEditorButtonBar({
  publish,
  save,
  cancelRoute,
  isSubmitting,
  disabled,
}: Readonly<{
  publish: () => void;
  save: () => void;
  cancelRoute: string;
  isSubmitting: boolean;
  disabled: boolean;
}>) {
  return (
    <StickyBottomBox>
      <BottomToolbar>
        <ButtonBar
          right={
            <>
              <InternalLinkButton href={cancelRoute} variant="plain">
                Abbrechen
              </InternalLinkButton>
              <SubmitButton
                submitting={isSubmitting}
                variant="outlined"
                disabled={disabled}
                onClick={save}
              >
                Entwurf speichern
              </SubmitButton>
              <SubmitButton
                submitting={isSubmitting}
                disabled={disabled}
                onClick={publish}
              >
                Veröffentlichen
              </SubmitButton>
            </>
          }
        />
      </BottomToolbar>
    </StickyBottomBox>
  );
}
