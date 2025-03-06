/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.departmentinfo;

import de.eshg.base.department.DepartmentApi;
import de.eshg.base.department.GetDepartmentInfoResponse;
import de.eshg.departmentinfo.domain.AbstractDepartmentInfo;
import de.eshg.departmentinfo.initialization.InitialDepartmentInfo;
import de.eshg.departmentinfo.initialization.OptionalInitialDepartmentInfo;
import de.eshg.persistence.TransactionHelper;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import java.lang.reflect.Field;
import java.util.Optional;
import java.util.function.Function;
import org.springframework.util.Assert;

public abstract class AbstractDepartmentInfoWithBaseModuleFallbackService<
        T extends AbstractDepartmentInfo>
    extends AbstractDepartmentInfoService<T> {

  private final OptionalInitialDepartmentInfo initialDepartmentInfo;
  private final DepartmentApi departmentApi;

  protected AbstractDepartmentInfoWithBaseModuleFallbackService(
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
  public T getConfig() {
    if (initialDepartmentInfo.useDepartmentInfoFromBaseModule()) {
      return getInitialConfiguration();
    }
    return super.getConfig();
  }

  @Override
  public void init() {
    if (!initialDepartmentInfo.useDepartmentInfoFromBaseModule()) {
      super.init();
    }
  }

  @Override
  protected T getInitialConfiguration() {
    GetDepartmentInfoResponse baseDepartmentInfo = departmentApi.getDepartmentInfo();

    T departmentInfo = createEmptyDepartmentInfoObject();

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
        useFromInitialConfigOrBase(InitialDepartmentInfo::homepage, baseDepartmentInfo.homepage()));
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
