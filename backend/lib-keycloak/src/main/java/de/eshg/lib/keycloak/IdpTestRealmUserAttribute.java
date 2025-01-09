/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

import de.cronn.commons.lang.StreamUtil;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class IdpTestRealmUserAttribute implements KeycloakUserAttribute {

  private final String samlName;
  private final IdpUserAttribute.AttributeNameFormat attributeNameFormat;

  IdpTestRealmUserAttribute(
      String samlName, IdpUserAttribute.AttributeNameFormat attributeNameFormat) {
    this.samlName = samlName;
    this.attributeNameFormat = attributeNameFormat;
  }

  @Override
  public String getKey() {
    return getNormalizedKey(getSamlName());
  }

  public static String getNormalizedKey(IdpUserAttribute idpUserAttribute) {
    return getNormalizedKey(idpUserAttribute.getSamlName());
  }

  private static String getNormalizedKey(String samlName) {
    return samlName.replace(":", "_");
  }

  @Override
  public String getDisplayName() {
    return getSamlName();
  }

  @Override
  public Group getGroup() {
    return Group.CUSTOM;
  }

  @Override
  public boolean isRequired() {
    return false;
  }

  @Override
  public UserAttributePermissions getPermissions() {
    return UserAttributePermissions.ALL;
  }

  @Override
  public List<ValidationRule> getValidationRules() {
    return List.of();
  }

  public String getSamlName() {
    return samlName;
  }

  public IdpUserAttribute.AttributeNameFormat getAttributeNameFormat() {
    return attributeNameFormat;
  }

  public static List<IdpTestRealmUserAttribute> fromIdpUserAttributes(
      IdpUserAttribute[] idpUserAttributes) {
    return Arrays.stream(idpUserAttributes)
        .collect(StreamUtil.groupingBy(IdpUserAttribute::getSamlName))
        .entrySet()
        .stream()
        .map(IdpTestRealmUserAttribute::getIdpTestRealmUserAttribute)
        .toList();
  }

  private static IdpTestRealmUserAttribute getIdpTestRealmUserAttribute(
      Map.Entry<String, List<IdpUserAttribute>> attributeEntry) {
    String samlName = attributeEntry.getKey();
    List<IdpUserAttribute> attributes = attributeEntry.getValue();
    return new IdpTestRealmUserAttribute(samlName, getAttributeNameFormat(samlName, attributes));
  }

  private static IdpUserAttribute.AttributeNameFormat getAttributeNameFormat(
      String samlName, List<IdpUserAttribute> attributes) {
    return attributes.stream()
        .map(IdpUserAttribute::getAttributeNameFormat)
        .distinct()
        .collect(
            StreamUtil.toSingleElement(
                list ->
                    new RuntimeException(
                        "Nested test realm user attributes need to conform to the same name format but found %s for attribute %s"
                            .formatted(list, samlName))));
  }
}
