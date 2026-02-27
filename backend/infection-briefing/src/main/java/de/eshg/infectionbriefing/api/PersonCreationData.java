/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.infectionbriefing.api;

import java.time.LocalDate;

public interface PersonCreationData {
  InfectionBriefingSalutationDto salutation();

  String firstName();

  String lastName();

  LocalDate dateOfBirth();

  String email();

  String phone();
}
