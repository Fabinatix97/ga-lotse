/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { ApiStiProtectionProcedure } from "@eshg/sti-protection-api";
import { Button } from "@mui/joy";
import { useFormikContext } from "formik";
import { useRouter } from "next/navigation";

import { routes } from "@/lib/businessModules/stiProtection/shared/routes";
import { StickyBottomButtonBar } from "@/lib/shared/components/buttons/StickyBottomButtonBar";

export interface TabStickyBottomButtonBarProps {
  onCancel?: () => void;
  procedure: ApiStiProtectionProcedure;
}

export function TabStickyBottomButtonBar({
  procedure,
  onCancel,
}: TabStickyBottomButtonBarProps) {
  const router = useRouter();
  const { isSubmitting } = useFormikContext();

  return (
    <StickyBottomButtonBar
      sx={{ padding: "0.75rem 1.5rem" }}
      right={
        <>
          <Button
            variant="plain"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                router.push(routes.procedures.byId(procedure.id).details);
              }
            }}
            aria-disabled={isSubmitting}
          >
            Abbrechen
          </Button>
          <SubmitButton submitting={isSubmitting}>Speichern</SubmitButton>
        </>
      }
    ></StickyBottomButtonBar>
  );
}
