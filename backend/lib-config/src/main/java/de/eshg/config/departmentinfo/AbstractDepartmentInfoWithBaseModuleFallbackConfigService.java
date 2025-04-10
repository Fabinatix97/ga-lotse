/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.config.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.config.domain.AbstractDepartmentInfoConfig;
import de.eshg.config.domain.DepartmentInfo;
import de.eshg.config.initialization.InitialDepartmentInfo;
import de.eshg.config.initialization.OptionalInitialDepartmentInfo;
import de.eshg.config.mapper.DepartmentInfoMapper;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import java.lang.reflect.Field;
import java.util.Optional;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

public abstract class AbstractDepartmentInfoWithBaseModuleFallbackConfigService<
        T extends AbstractDepartmentInfoConfig>
    extends AbstractDepartmentInfoConfigService<T> {

  private final OptionalInitialDepartmentInfo initialDepartmentInfo;
  private final DepartmentApi departmentApi;

  private static final Logger log =
      LoggerFactory.getLogger(AbstractDepartmentInfoWithBaseModuleFallbackConfigService.class);

  protected AbstractDepartmentInfoWithBaseModuleFallbackConfigService(
      EntityManager entityManager,
      TransactionHelper transactionHelper,
      DepartmentApi departmentApi,
      OptionalInitialDepartmentInfo initialDepartmentInfo,
      Class<T> configClass) {
    super(entityManager, transactionHelper, configClass);
    this.initialDepartmentInfo = initialDepartmentInfo;
    this.departmentApi = departmentApi;
  }

  @Override
  @Transactional(readOnly = true)
  public GetDepartmentInfoResponse getDepartmentInfo() {
    return Optional.ofNullable(getConfig().getDepartmentInfo())
        .map(DepartmentInfoMapper::mapToDepartmentInfoResponse)
        .orElseGet(departmentApi::getDepartmentInfo);
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
    } else {
      log.info("Using custom department info.");
      GetDepartmentInfoResponse baseDepartmentInfo = departmentApi.getDepartmentInfo();

      DepartmentInfo departmentInfo = new DepartmentInfo();
      departmentInfo.setName(
          useFromInitialConfigOrBase(InitialDepartmentInfo::name, baseDepartmentInfo.name()));
      departmentInfo.setAbbreviation(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::abbreviation, baseDepartmentInfo.abbreviation()));
      departmentInfo.setStreet(
          useFromInitialConfigOrBase(InitialDepartmentInfo::street, baseDepartmentInfo.street()));
      departmentInfo.setHouseNumber(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::houseNumber, baseDepartmentInfo.houseNumber()));
      departmentInfo.setPostalCode(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::postalCode, baseDepartmentInfo.postalCode()));
      departmentInfo.setCity(
          useFromInitialConfigOrBase(InitialDepartmentInfo::city, baseDepartmentInfo.city()));
      departmentInfo.setCountry(
          useFromInitialConfigOrBase(InitialDepartmentInfo::country, baseDepartmentInfo.country()));
      departmentInfo.setPhoneNumber(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::phoneNumber, baseDepartmentInfo.phoneNumber()));
      departmentInfo.setHomepage(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::homepage, baseDepartmentInfo.homepage()));
      departmentInfo.setEmail(
          useFromInitialConfigOrBase(InitialDepartmentInfo::email, baseDepartmentInfo.email()));

      departmentInfo.setLongitude(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::longitude, baseDepartmentInfo.location().longitude()));
      departmentInfo.setLatitude(
          useFromInitialConfigOrBase(
              InitialDepartmentInfo::latitude, baseDepartmentInfo.location().latitude()));
      return departmentInfo;
    }
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

  private <U> U useFromInitialConfigOrBase(Function<InitialDepartmentInfo, U> fn, U fallback) {
    return Optional.ofNullable(initialDepartmentInfo).map(fn).orElse(fallback);
  }
}
