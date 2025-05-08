/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useValidateLength } from "@eshg/lib-portal/hooks/useValidators";

import { useTranslation } from "@/lib/i18n/client";
import { TextareaField } from "@/lib/shared/components/form/TextareaField";

interface DocumentTextareaElementProps {
  label: string;
  name: string;
}

export function DocumentTextareaElement({
  label,
  name,
}: Readonly<DocumentTextareaElementProps>) {
  const { t } = useTranslation(["travelMedicine/document"]);
  const validateLength = useValidateLength();

  return (
    <TextareaField
      sxTextarea={{
        flex: 1,
        display: "flex",
        flexGrow: 1,
        width: "100%",
      }}
      sx={{ flex: 1 }}
      name={name}
      placeholder={t("textareaPlaceholder")}
      label={label}
      validate={validateLength(0, 4000)}
      minRows={1}
    />
  );
}
