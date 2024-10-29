/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.scheduling;

import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Table for the ShedLock lock provider.
 *
 * @see <a
 *     href="https://github.com/lukas-krecan/ShedLock?tab=readme-ov-file#configure-lockprovider">ShedLock
 *     - Configure LockProvider</a>
 */
@Entity
@Table(name = "shedlock")
@DataSensitivity(SensitivityLevel.PSEUDONYMIZED)
public class Shedlock {

  @Id
  @Column(nullable = false, columnDefinition = "varchar(64)")
  private String name;

  @Column(nullable = false, columnDefinition = "timestamp")
  private Instant lockedAt;

  @Column(nullable = false, columnDefinition = "timestamp")
  private Instant lockUntil;

  @Column(nullable = false, columnDefinition = "varchar(255)")
  private String lockedBy;
}
