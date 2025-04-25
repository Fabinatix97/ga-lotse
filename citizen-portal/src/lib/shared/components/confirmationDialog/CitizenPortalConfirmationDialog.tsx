/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { isDefined } from "remeda";

import {
  BaseConfirmationDialog,
  ConfirmationDialogProps,
} from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialog";

import { useTranslation } from "@/lib/i18n/client";
import { CitizenConfirmationButtonBar } from "@/lib/shared/components/confirmationDialog/CitizenConfirmationButtonBar";

export function CitizenPortalConfirmationDialog(
  props: Readonly<ConfirmationDialogProps>,
) {
  const { t } = useTranslation();

  const title = isDefined(props.title)
    ? props.title
    : t("confirmation_dialog.title");
  const description = isDefined(props.description)
    ? props.description
    : t("confirmation_dialog.description");
  const confirmLabel = isDefined(props.confirmLabel)
    ? props.confirmLabel
    : t("confirmation_dialog.confirm_label");
  const cancelLabel = isDefined(props.cancelLabel)
    ? props.cancelLabel
    : t("confirmation_dialog.cancel_label");

  return (
    <BaseConfirmationDialog
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      buttonBarComponent={CitizenConfirmationButtonBar}
      {...props}
    />
  );
}
