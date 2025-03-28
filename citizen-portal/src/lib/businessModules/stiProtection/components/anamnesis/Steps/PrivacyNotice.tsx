/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Box } from "@mui/joy";
import { useTranslation } from "react-i18next";

export function PrivacyNotice() {
  const { t } = useTranslation(["stiProtection/anamnesis"]);

  return (
    <Box>
      <Alert message={t("privacyNotice")} color="primary" />
    </Box>
  );
}
