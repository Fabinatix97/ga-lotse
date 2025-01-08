/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { validateRegex } from "../../helpers/validators";

const lifetimeDoctorNumberRegex = new RegExp(/^\d{9}$/);

export const lifetimeDoctorNumberValidator = validateRegex(
  lifetimeDoctorNumberRegex,
  "Bitte eine gültige lebenslange Arztnummer angeben.",
);
