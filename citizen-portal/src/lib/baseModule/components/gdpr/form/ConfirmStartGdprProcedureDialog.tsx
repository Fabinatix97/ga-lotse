/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGdprProcedureType } from "@eshg/citizen-portal-api/base";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { useResetAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { isDefined } from "remeda";

import { useAddGdprProcedure } from "@/lib/baseModule/api/mutations/gdpr";
import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

interface ConfirmStartGdprProcedureDialogProps {
  type: ApiGdprProcedureType | undefined;
  userType: UserType;
  onClose: () => void;
}

export function ConfirmStartGdprProcedureDialog({
  type,
  userType,
  onClose,
}: ConfirmStartGdprProcedureDialogProps) {
  const addGdprProcedure = useAddGdprProcedure();
  const resetAlertContext = useResetAlertContext();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation("gdpr");
  const routes = useRoutes();
  const router = useRouter();

  function handleClose() {
    resetAlertContext();
    onClose();
  }

  function handleSubmit() {
    if (type == ApiGdprProcedureType.ToRectification) {
      router.push(
        userType === "organization"
          ? routes.organizationPath.mukPortal.profile
          : routes.citizenPath.bundIdPortal.profile,
      );
      return;
    }

    if (isDefined(type)) {
      startTransition(() =>
        addGdprProcedure.mutate(
          {
            type: type,
            matterOfConcern: undefined,
          },
          {
            onSuccess: handleClose,
          },
        ),
      );
    }
  }

  return (
    <BaseModal
      modalTitle={t(`start_procedure_dialog.${type}.title`)}
      open={isDefined(type) && type !== ApiGdprProcedureType.ToObject}
      onClose={handleClose}
    >
      <Stack gap={2}>
        <Typography>
          {t(`start_procedure_dialog.${type}.description`)}
        </Typography>
        <Typography level="title-md">
          {/* TODO: Load attributes with get /self */}
          Max Mustermann
          <br />
          Hauptstraße 33, 54032 Köln
          <br />
          Deutschland
        </Typography>
        <Stack alignSelf="end" gap={2} direction="row">
          <Button variant="outlined" onClick={handleClose}>
            {t("translation:common.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            loadingPosition="start"
            loading={isPending}
          >
            {t(`start_procedure_dialog.${type}.submit`)}
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
}
