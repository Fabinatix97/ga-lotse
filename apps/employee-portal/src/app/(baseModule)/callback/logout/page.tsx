/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { redirect } from "next/navigation";

// This page is part of the auth flow and will be redirected to after the user is signed out from keycloak.
export default function Logout() {
  redirect("/");
}
