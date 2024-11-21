/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { validateRegex } from "@eshg/lib-portal/helpers/validators";

const lifetimeDoctorNumberRegex = new RegExp(/^\d{9}$/);

export const lifetimeDoctorNumberValidator = validateRegex(
  lifetimeDoctorNumberRegex,
  "Bitte eine gültige lebenslange Arztnummer angeben.",
);
