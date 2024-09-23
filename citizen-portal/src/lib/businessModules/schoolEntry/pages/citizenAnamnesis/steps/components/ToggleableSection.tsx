/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BooleanRadioField } from "@eshg/lib-portal/components/formFields/BooleanRadioField";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { isDefined } from "remeda";

import { useTranslation } from "@/lib/i18n/client";

export interface ToggleableSectionProps {
  title?: string;
  name: string;
}

export function ToggleableSection({
  title,
  children,
  name,
}: ToggleableSectionProps & RequiresChildren) {
  const [field] = useField<boolean>(name);
  const { t } = useTranslation("schoolEntry/anamnesis");
  return (
    <Stack>
      <BooleanRadioField
        name={name}
        orientation="horizontal"
        label={
          isDefined(title) && <Typography level="title-md">{title}</Typography>
        }
        trueLabel={t("yes")}
        falseLabel={t("no")}
      />
      {field.value && children}
    </Stack>
  );
}
