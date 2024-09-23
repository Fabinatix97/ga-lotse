/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  FormSheet,
  FormSheetTitle,
} from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function VaccinationStep() {
  const { t } = useTranslation(["travelMedicine/forms"]);

  return (
    <FormSheet>
      <FormSheetTitle>{t("vaccinationFormContent.title")}</FormSheetTitle>
    </FormSheet>
  );
}
