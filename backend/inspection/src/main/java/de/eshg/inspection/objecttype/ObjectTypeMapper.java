/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype;

import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import de.eshg.inspection.objecttype.api.UpdateObjectTypeRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;

public class ObjectTypeMapper {

  private ObjectTypeMapper() {}

  public static ObjectTypeDto toDto(ObjectType objectType) {
    if (objectType == null) {
      return null;
    }
    return new ObjectTypeDto(
        objectType.getId(),
        objectType.getName(),
        objectType.getRoutineInterval(),
        objectType.getComplaintInterval(),
        objectType.getStandardDuration(),
        objectType.getStandardBufferTime(),
        objectType.isEmailAnnouncement());
  }

  public static ObjectType mapUpdateRequest(
      UpdateObjectTypeRequest request, ObjectType objectType) {
    objectType.setComplaintInterval(request.complaintInterval());
    objectType.setRoutineInterval(request.routineInterval());
    objectType.setStandardDuration(request.standardDuration());
    objectType.setStandardBufferTime(request.standardBufferTime());
    objectType.setEmailAnnouncement(
        // sonar wrongly assumes that emailAnnouncement() can not be null, but it can
        request.emailAnnouncement() != null /*NOSONAR: S2589*/ && request.emailAnnouncement());

    return objectType;
  }
}
