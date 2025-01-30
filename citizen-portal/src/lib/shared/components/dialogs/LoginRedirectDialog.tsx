/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { Button, Stack, Typography } from "@mui/joy";
import { Trans } from "react-i18next";

import { UserType } from "@/lib/baseModule/components/layout/types";
import { useRoutes } from "@/lib/baseModule/shared/routes";
import { useTranslation } from "@/lib/i18n/client";

interface LoginRedirectDialogProps {
  type: UserType;
  open: boolean;
  onClose: () => void;
}

export function LoginRedirectDialog(props: Readonly<LoginRedirectDialogProps>) {
  const routes = useRoutes();
  const { t } = useTranslation();

  function dialogText(key: string) {
    return t(`login:login_dialog.${props.type}.${key}`);
  }

  return (
    <BaseModal
      open={props.open}
      onClose={props.onClose}
      modalTitle={dialogText("title")}
    >
      <Typography>
        <Trans
          i18nKey={`login:login_dialog.${props.type}.description`}
          components={{
            Quote: (
              <Typography
                sx={{
                  minWidth: "fit-content",
                  display: "inline-block",
                }}
              />
            ),
          }}
        />
      </Typography>
      <Stack direction="row" justifyContent="end" gap={2}>
        <Button
          onClick={() => props.onClose()}
          variant="outlined"
          color="primary"
        >
          {t("translation:common.cancel")}
        </Button>
        <InternalLinkButton
          href={
            props.type === "organization"
              ? routes.organizationPath.mukPortal.overview
              : routes.citizenPath.bundIdPortal.overview
          }
        >
          {dialogText("submit")}
        </InternalLinkButton>
      </Stack>
    </BaseModal>
  );
}
