/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type Redirect } from "next/dist/lib/load-custom-routes";

import { routes } from "./config/routes";

const redirects: Redirect[] = [
  {
    source: routes.index,
    destination: routes.prophylaxisSessions.overview,
    permanent: true,
  },
  {
    source: routes.prophylaxisSessions.byId(":prophylaxisSessionId").index,
    destination: routes.prophylaxisSessions.byId(":prophylaxisSessionId")
      .details,
    permanent: true,
  },
  {
    source: routes.prophylaxisSessions.byId(":prophylaxisSessionId")
      .examinations.index,
    destination: routes.prophylaxisSessions.byId(":prophylaxisSessionId")
      .details,
    permanent: true,
  },
  {
    source: routes.children.byId(":childId").index,
    destination: routes.children.byId(":childId").details,
    permanent: true,
  },
];

export default redirects;
