/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo.initialization;

import static de.eshg.util.ResourceUtils.assertIsReadable;

import de.eshg.departmentinfo.spring.DepartmentInfoPropertyBinding;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.core.io.Resource;

@ConfigurationProperties(prefix = DepartmentInfoPropertyBinding.DEFAULT_PROPERTY_PREFIX)
public class OptionalInitialPrivacyDocuments implements InitialPrivacyDocuments {
  private boolean usePrivacyDocumentsFromBaseModule = true;
  private Resource privacyPolicy;
  private Resource privacyNotice;

  public boolean usePrivacyDocumentsFromBaseModule() {
    return usePrivacyDocumentsFromBaseModule;
  }

  public void setUsePrivacyDocumentsFromBaseModule(boolean usePrivacyDocumentsFromBaseModule) {
    this.usePrivacyDocumentsFromBaseModule = usePrivacyDocumentsFromBaseModule;
  }

  @Override
  public Resource privacyPolicy() {
    return privacyPolicy;
  }

  @Override
  public Resource privacyNotice() {
    return privacyNotice;
  }

  public void setPrivacyPolicy(Resource privacyPolicy) {
    assertIsReadable(privacyPolicy, "privacy-policy");
    this.privacyPolicy = privacyPolicy;
  }

  public void setPrivacyNotice(Resource privacyNotice) {
    assertIsReadable(privacyNotice, "privacy-notice");
    this.privacyNotice = privacyNotice;
  }
}
