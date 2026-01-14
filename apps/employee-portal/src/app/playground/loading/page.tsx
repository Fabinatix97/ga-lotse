/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/** This page never finishes loading and forces the loading.tsx LoadingIndicator to show up */
export default async function PlaygroundLoadingPage() {
  await new Promise((resolve) => setTimeout(resolve, 999_999_999));
}
