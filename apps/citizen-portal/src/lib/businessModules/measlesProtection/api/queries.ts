/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal";

import { useOrganisationPortalApi } from "./clients";

export function usePrivacyNoticeFile() {
  const orgApi = useOrganisationPortalApi();
  return useFileDownload(() => orgApi.getPrivacyNoticeRaw());
}
export function usePrivacyPolicyFile() {
  const orgApi = useOrganisationPortalApi();
  return useFileDownload(() => orgApi.getPrivacyPolicyRaw());
}
