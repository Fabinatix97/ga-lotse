/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { useField } from "formik";
import { isDefined } from "remeda";

import { BooleanRadioField, RequiresChildren } from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";

interface ToggleableSectionProps {
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
        allowDeselection
      />
      {field.value && children}
    </Stack>
  );
}
