/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BottomToolbar } from "@eshg/lib-employee-portal/components/toolbar/BottomToolbar";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
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
                onClick={save}
                variant="outlined"
                disabled={disabled}
              >
                Entwurf speichern
              </SubmitButton>
              <SubmitButton
                submitting={isSubmitting}
                onClick={publish}
                disabled={disabled}
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
