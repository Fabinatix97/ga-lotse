/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { HiddenContainer } from "../../components/HiddenContainer";

export const DOWNLOAD_CONTAINER_ID = "hidden-download-container";

export function HiddenDownloadContainer() {
  return <HiddenContainer id={DOWNLOAD_CONTAINER_ID} />;
}
