/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiStiProtectionProcedure } from "@eshg/employee-portal-api/stiProtection";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { useFormikContext } from "formik";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

export interface TabStickyBottomButtonBarProps {
  procedure: ApiStiProtectionProcedure;
}

export function TabStickyBottomButtonBar({
  procedure,
}: TabStickyBottomButtonBarProps) {
  const { isSubmitting } = useFormikContext();

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <InternalLinkButton
            href={routes.procedures.byId(procedure.id).details}
            variant="plain"
          >
            Abbrechen
          </InternalLinkButton>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
