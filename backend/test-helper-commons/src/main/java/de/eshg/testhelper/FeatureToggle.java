/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.testhelper;

import de.eshg.rest.service.error.BadRequestException;
import jakarta.annotation.PostConstruct;
import java.util.LinkedHashSet;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.Assert;

/**
 * Base class for feature toggles.
 *
 * <p>Feature toggles are properties that control the activation of features within a system. They
 * are temporary and intended to be removed once the feature is fully rolled out or no longer
 * needed.
 *
 * <p>This class serves as a base for all feature toggle implementations, providing a standardized
 * way to manage feature flags across the application.
 *
 * <p>Unlike other implementations of {@link ResettableProperties}, feature toggles are short-lived
 * and should be cleaned up when they are no longer required.
 */
public abstract class FeatureToggle<T extends Enum<T>> implements ResettableProperties {

  private Set<T> enabledNewFeatures = new LinkedHashSet<>();
  private Set<T> disabledOldFeatures = new LinkedHashSet<>();

  @PostConstruct
  public void logFeatures() {
    Logger log = LoggerFactory.getLogger(this.getClass());
    log.info("Enabled new features: {}", getEnabledNewFeatures());
    log.info("Disabled old features: {}", getDisabledOldFeatures());
  }

  public Set<T> getEnabledNewFeatures() {
    return enabledNewFeatures;
  }

  public void setEnabledNewFeatures(Set<T> enabledNewFeatures) {
    this.enabledNewFeatures = enabledNewFeatures;
  }

  public Set<T> getDisabledOldFeatures() {
    return disabledOldFeatures;
  }

  public void setDisabledOldFeatures(Set<T> disabledOldFeatures) {
    this.disabledOldFeatures = disabledOldFeatures;
  }

  public void enableNewFeature(T feature) {
    boolean added = getEnabledNewFeatures().add(feature);
    Assert.isTrue(added, () -> "New feature " + feature + " already enabled");
  }

  public void disableNewFeature(T feature) {
    boolean removed = getEnabledNewFeatures().remove(feature);
    Assert.isTrue(removed, () -> "New feature " + feature + " already disabled");
  }

  public void disableOldFeature(T feature) {
    boolean added = getDisabledOldFeatures().add(feature);
    Assert.isTrue(added, () -> "Old feature " + feature + " already disabled");
  }

  public void enableOldFeature(T feature) {
    boolean removed = getDisabledOldFeatures().remove(feature);
    Assert.isTrue(removed, () -> "Old feature " + feature + " already enabled");
  }

  public boolean isNewFeatureEnabled(T feature) {
    return getEnabledNewFeatures().contains(feature);
  }

  public boolean isNewFeatureDisabled(T feature) {
    return !isNewFeatureEnabled(feature);
  }

  public boolean isOldFeatureDisabled(T feature) {
    return getDisabledOldFeatures().contains(feature);
  }

  public boolean isOldFeatureEnabled(T feature) {
    return !isOldFeatureDisabled(feature);
  }

  public void assertNewFeatureIsEnabled(T feature) {
    if (!isNewFeatureEnabled(feature)) {
      throw new BadRequestException("New feature %s is not enabled".formatted(feature));
    }
  }

  public void assertOldFeatureIsStillEnabled(T feature) {
    if (isOldFeatureDisabled(feature)) {
      throw new BadRequestException("Old feature %s is disabled".formatted(feature));
    }
  }
}
