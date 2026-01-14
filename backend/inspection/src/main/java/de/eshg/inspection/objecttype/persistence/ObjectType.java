/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype.persistence;

import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsLast;

import de.eshg.domain.model.GloballyUniqueEntityBase;
import de.eshg.lib.common.DataSensitivity;
import de.eshg.lib.common.SensitivityLevel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.util.Comparator;

@Entity
public class ObjectType extends GloballyUniqueEntityBase {

  @DataSensitivity(SensitivityLevel.PUBLIC)
  @Column(unique = true, nullable = false)
  @NotNull
  private String name;

  /** the interval for routine inspections, in days */
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @PositiveOrZero
  private Integer routineInterval;

  /** the interval for complaint inspections, in days */
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @PositiveOrZero
  private Integer complaintInterval; // days

  /** the standard duration of an inspection for this type of objects, in hours */
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @PositiveOrZero
  private Integer standardDuration; // hours

  /** the buffer time to plan for arrival at the facility before inspection begins, in minutes */
  @DataSensitivity(SensitivityLevel.PUBLIC)
  @PositiveOrZero
  private Integer standardBufferTime; // minutes

  /** whether an announcement is required or not */
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private boolean emailAnnouncement;

  @DataSensitivity(SensitivityLevel.PUBLIC)
  private String legalBasis;

  @Column
  @DataSensitivity(SensitivityLevel.PUBLIC)
  private Integer originalIndex;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getRoutineInterval() {
    return routineInterval;
  }

  public void setRoutineInterval(Integer routineInterval) {
    this.routineInterval = routineInterval;
  }

  public Integer getComplaintInterval() {
    return complaintInterval;
  }

  public void setComplaintInterval(Integer complaintInterval) {
    this.complaintInterval = complaintInterval;
  }

  public Integer getStandardDuration() {
    return standardDuration;
  }

  public void setStandardDuration(Integer standardDuration) {
    this.standardDuration = standardDuration;
  }

  public Integer getStandardBufferTime() {
    return standardBufferTime;
  }

  public void setStandardBufferTime(Integer standardBufferTime) {
    this.standardBufferTime = standardBufferTime;
  }

  public boolean isEmailAnnouncement() {
    return emailAnnouncement;
  }

  public void setEmailAnnouncement(boolean emailAnnouncement) {
    this.emailAnnouncement = emailAnnouncement;
  }

  public String getLegalBasis() {
    return legalBasis;
  }

  public void setLegalBasis(String legalBasis) {
    this.legalBasis = legalBasis;
  }

  public Integer getOriginalIndex() {
    return originalIndex;
  }

  public void setOriginalIndex(Integer originalIndex) {
    this.originalIndex = originalIndex;
  }

  /**
   * A singleton instance of the {@link ObjectTypeNameComparator} that compares {@code ObjectType}s
   * by {@code name}.
   */
  public static final ObjectTypeNameComparator OBJECTTYPE_NAME_COMPARATOR =
      new ObjectTypeNameComparator();

  /** A comparator for {@code ObjectType} that only compares ObjectTypes by {@code name}. */
  public static class ObjectTypeNameComparator implements Comparator<ObjectType> {
    @Override
    public int compare(ObjectType o1, ObjectType o2) {
      return o1.name.compareTo(o2.name);
    }
  }

  /**
   * A singleton instance of the {@link ObjectTypeFullEqualityComparator} that compares all
   * attributes of {@code ObjectType}.
   */
  public static final ObjectTypeFullEqualityComparator OBJECTTYPE_FULL_EQUALITY_COMPARATOR =
      new ObjectTypeFullEqualityComparator();

  /** A comparator for {@code ObjectType} that compares <i>all</i> attributes. */
  public static class ObjectTypeFullEqualityComparator implements Comparator<ObjectType> {
    @Override
    public int compare(ObjectType o1, ObjectType o2) {
      return Comparator.comparing(ObjectType::getId)
          .thenComparing(ObjectType::getName)
          .thenComparing(ObjectType::isEmailAnnouncement)
          .thenComparing(ObjectType::getRoutineInterval, nullsLast(naturalOrder()))
          .thenComparing(ObjectType::getComplaintInterval, nullsLast(naturalOrder()))
          .thenComparing(ObjectType::getStandardDuration, nullsLast(naturalOrder()))
          .thenComparing(ObjectType::getStandardBufferTime, nullsLast(naturalOrder()))
          .thenComparing(ObjectType::getLegalBasis, nullsLast(naturalOrder()))
          .compare(o1, o2);
    }
  }
}
