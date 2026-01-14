/*
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import static de.eshg.config.mapper.DepartmentInfoMapper.mapToDomain;

import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.base.department.PublicDepartmentApi;
import de.eshg.config.AuditLogWriter;
import de.eshg.config.domain.AbstractDepartmentInfoConfig;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.initialization.OptionalInitialDepartmentInfo;
import de.eshg.config.mapper.DepartmentInfoMapper;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import java.lang.reflect.Field;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

public abstract class AbstractDepartmentInfoWithBaseModuleFallbackConfigService<
        T extends AbstractDepartmentInfoConfig>
    extends AbstractDepartmentInfoConfigService<T> {

  public static final String DEPARTMENT_INFO_IS_NOT_COMPLETE = "Department info is not complete.";
  private final OptionalInitialDepartmentInfo initialDepartmentInfo;
  private final PublicDepartmentApi publicDepartmentApi;

  private static final Logger log =
      LoggerFactory.getLogger(AbstractDepartmentInfoWithBaseModuleFallbackConfigService.class);

  protected AbstractDepartmentInfoWithBaseModuleFallbackConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      PublicDepartmentApi publicDepartmentApi,
      OptionalInitialDepartmentInfo initialDepartmentInfo,
      AuditLogWriter auditLogWriter,
      Class<T> configClass) {
    super(entityManager, transactionHelper, auditLogWriter, configClass);
    this.initialDepartmentInfo = initialDepartmentInfo;
    this.publicDepartmentApi = publicDepartmentApi;
  }

  @Override
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return Optional.ofNullable(getConfig().getDepartmentInfo())
        .map(DepartmentInfoMapper::mapToDepartmentInfoResponse)
        .orElseGet(publicDepartmentApi::getDepartmentInfo);
  }

  @Override
  protected T getInitialConfiguration() {
    T departmentInfoConfig = createEmptyDepartmentInfoObject();
    departmentInfoConfig.setDepartmentInfo(createDepartmentInfo());
    return departmentInfoConfig;
  }

  private DepartmentInfo createDepartmentInfo() {
    if (initialDepartmentInfo.useDepartmentInfoFromBaseModule()) {
      log.info("Using department info from base module.");
      return null;
    } else if (!checkIfDepartmentInfoIsComplete(initialDepartmentInfo)) {
      throw new IllegalStateException(DEPARTMENT_INFO_IS_NOT_COMPLETE);
    } else {
      log.info("Using custom department info.");
      return mapToDomain(initialDepartmentInfo);
    }
  }

  private boolean checkIfDepartmentInfoIsComplete(
      OptionalInitialDepartmentInfo initialDepartmentInfo) {
    for (var component : initialDepartmentInfo.getClass().getRecordComponents()) {
      try {
        if (component.getAccessor().invoke(initialDepartmentInfo) == null) {
          return false;
        }
      } catch (Exception e) {
        throw new RuntimeException(e);
      }
    }
    return true;
  }

  @PostConstruct
  public void sanityCheck() throws IllegalAccessException {
    if (initialDepartmentInfo.useDepartmentInfoFromBaseModule()) {
      Assert.isTrue(
          emptyInitialDepartmentInfoProperties(),
          "Department info properties set although 'use-department-info-from-base-module' is set to true");
    }
  }

  private boolean emptyInitialDepartmentInfoProperties() throws IllegalAccessException {
    for (Field field : initialDepartmentInfo.getClass().getDeclaredFields()) {
      if (field.getName().equals("useDepartmentInfoFromBaseModule")) {
        continue;
      }

      field.setAccessible(true);
      Object value = field.get(initialDepartmentInfo);
      if (value != null) {
        return false;
      }
    }
    return true;
  }

  protected abstract T createEmptyDepartmentInfoObject();
}
