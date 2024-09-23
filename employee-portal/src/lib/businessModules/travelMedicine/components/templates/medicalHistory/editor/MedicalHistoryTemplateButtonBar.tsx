/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";

import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

export function MedicalHistoryTemplateButtonBar({
  publish,
  save,
  cancelRoute,
  isSubmitting,
}: Readonly<{
  publish: () => void;
  save: () => void;
  cancelRoute: string;
  isSubmitting: boolean;
}>) {
  return (
    <StickyBottomButtonBar
      right={
        <>
          <InternalLinkButton href={cancelRoute} variant="plain">
            Abbrechen
          </InternalLinkButton>
          <SubmitButton
            submitting={isSubmitting}
            onClick={save}
            variant="outlined"
          >
            Entwurf speichern
          </SubmitButton>
          <SubmitButton submitting={isSubmitting} onClick={publish}>
            Veröffentlichen
          </SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
