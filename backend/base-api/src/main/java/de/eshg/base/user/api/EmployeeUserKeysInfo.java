/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.user.api;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public interface EmployeeUserKeysInfo {

  @Schema(
      description =
          """
The version of the crypto settings used.
A new crypto version (increased by 1) will become available every time something is changed regarding the GA-Lotse crypto settings for the keys stored here.
This attribute tracks, which settings were in use, when the key pair was created""",
      examples = {"1", "2", "3"})
  @NotNull
  int cryptoVersion();

  @Schema(
      description =
          """
       Usually the sha256 hash of the corresponding public key.
       Used to distinguish keys, i.e. to recognize if the currently active keys are the keys that have been used (in the past) to encrypt a given set of data
       """)
  String keyIdentifier();
}
