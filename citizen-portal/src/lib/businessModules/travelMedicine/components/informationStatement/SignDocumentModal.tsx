/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalPropsRequiredClose,
} from "@eshg/lib-portal/components/BaseModal";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";

import { SignDocumentModalContent } from "@/lib/businessModules/travelMedicine/components/informationStatement/SignDocumentModalContent";
import { useTranslation } from "@/lib/i18n/client";

type SignDocumentModalProps = Omit<
  BaseModalPropsRequiredClose,
  "children" | "modalTitle"
>;

export function SignDocumentModal({
  sx,
  ...props
}: Readonly<SignDocumentModalProps>) {
  const { t } = useTranslation(["travelMedicine/signature"]);

  return (
    <QueryBoundary>
      <BaseModal
        modalTitle={t("modal.title")}
        key="sign-information-statement-modal"
        sx={{ width: 820, ...sx }}
        {...props}
      >
        <SignDocumentModalContent closeModal={props.onClose} />
      </BaseModal>
    </QueryBoundary>
  );
}
