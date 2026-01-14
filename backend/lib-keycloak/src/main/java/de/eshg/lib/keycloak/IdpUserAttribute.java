/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.keycloak;

public interface IdpUserAttribute {
  CitizenUserAttribute getCitizenUserAttribute();

  String getSamlName();

  AttributeNameFormat getAttributeNameFormat();

  enum AttributeNameFormat {
    BASIC("ATTRIBUTE_FORMAT_BASIC", "Basic"),
    URI("ATTRIBUTE_FORMAT_URI", "URI Reference");

    private final String idpMapperName;
    private final String protocolMapperName;

    AttributeNameFormat(String idpMapperName, String protocolMapperName) {
      this.idpMapperName = idpMapperName;
      this.protocolMapperName = protocolMapperName;
    }

    public String getIdpMapperName() {
      return idpMapperName;
    }

    public String getProtocolMapperName() {
      return protocolMapperName;
    }
  }
}
