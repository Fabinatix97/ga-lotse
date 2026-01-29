/*
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.inspection.objecttype;

import de.eshg.base.user.api.UserDto;
import de.eshg.inspection.objecttype.api.ObjectTypeDto;
import de.eshg.inspection.objecttype.api.ObjectTypeHierarchyTreeNodeDto;
import de.eshg.inspection.objecttype.api.UpdateObjectTypeRequest;
import de.eshg.inspection.objecttype.persistence.ObjectType;
import de.eshg.inspection.objecttype.persistence.ObjectTypeHierarchyTreeNode;
import java.util.Comparator;
import java.util.Map;
import java.util.UUID;

public class ObjectTypeMapper {

  private ObjectTypeMapper() {}

  public static ObjectTypeDto toDto(ObjectType objectType) {
    return toDto(objectType, null);
  }

  public static ObjectTypeDto toDto(ObjectType objectType, UserDto assignee) {
    if (objectType == null) {
      return null;
    }
    String name = formatName(assignee);
    return new ObjectTypeDto(
        objectType.getId(),
        objectType.getName(),
        objectType.getRoutineInterval(),
        objectType.getComplaintInterval(),
        objectType.getStandardDuration(),
        objectType.getStandardBufferTime(),
        objectType.isEmailAnnouncement(),
        objectType.getLegalBasis(),
        objectType.getDesignatedAssigneeId(),
        name);
  }

  private static String formatName(UserDto user) {
    if (user == null) return null;
    String fn = user.firstName();
    String ln = user.lastName();
    if (fn != null && !fn.isBlank() && ln != null && !ln.isBlank()) return fn + " " + ln;
    if (fn != null && !fn.isBlank()) return fn;
    if (ln != null && !ln.isBlank()) return ln;
    return null;
  }

  public static ObjectTypeHierarchyTreeNodeDto toDto(ObjectTypeHierarchyTreeNode treeNode) {
    if (treeNode == null) {
      return null;
    }
    return new ObjectTypeHierarchyTreeNodeDto(
        treeNode.getName(),
        treeNode.getSubNodes().stream().map(ObjectTypeMapper::toDto).toList(),
        treeNode.getObjectTypes().stream()
            .map(ObjectTypeMapper::toDto)
            .sorted(Comparator.comparing(ObjectTypeDto::name))
            .toList());
  }

  public static ObjectTypeHierarchyTreeNodeDto toDto(
      ObjectTypeHierarchyTreeNode treeNode, Map<UUID, UserDto> userMap) {
    if (treeNode == null) {
      return null;
    }
    var subNodes = treeNode.getSubNodes().stream().map(n -> toDto(n, userMap)).toList();
    var objectTypes =
        treeNode.getObjectTypes().stream()
            .map(
                ot -> toDto(ot, userMap == null ? null : userMap.get(ot.getDesignatedAssigneeId())))
            .sorted(Comparator.comparing(ObjectTypeDto::name))
            .toList();

    return new ObjectTypeHierarchyTreeNodeDto(treeNode.getName(), subNodes, objectTypes);
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
    objectType.setLegalBasis(request.legalBasis());
    objectType.setDesignatedAssigneeId(request.designatedAssigneeId());

    return objectType;
  }
}
