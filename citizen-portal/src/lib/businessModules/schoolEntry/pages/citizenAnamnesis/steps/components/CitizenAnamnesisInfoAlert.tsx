/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";

import { useTranslation } from "@/lib/i18n/client";

export function CitizenAnamnesisInfoAlert() {
  const { t } = useTranslation(["schoolEntry/anamnesis"]);
  return <Alert title="" color="primary" message={t("information")} />;
}
