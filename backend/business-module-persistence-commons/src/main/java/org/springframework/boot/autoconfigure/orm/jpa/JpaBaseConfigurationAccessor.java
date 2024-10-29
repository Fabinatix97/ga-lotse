/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package org.springframework.boot.autoconfigure.orm.jpa;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.io.ResourceLoader;
import org.springframework.orm.jpa.persistenceunit.ManagedClassNameFilter;
import org.springframework.orm.jpa.persistenceunit.PersistenceManagedTypes;

/*
 * Helper class for SortedPersistenceManagedTypes which serves as workaround for
 * https://github.com/spring-projects/spring-framework/issues/33771
 *
 * Please remove this class once we got rid of SortedPersistenceManagedTypes,
 * after upgrading to Spring 6.2.0 via Spring Boot 3.4.0.
 */
public final class JpaBaseConfigurationAccessor {

  private JpaBaseConfigurationAccessor() {}

  public static PersistenceManagedTypes persistenceManagedTypes(
      BeanFactory beanFactory,
      ResourceLoader resourceLoader,
      ObjectProvider<ManagedClassNameFilter> managedClassNameFilter) {
    return JpaBaseConfiguration.PersistenceManagedTypesConfiguration.persistenceManagedTypes(
        beanFactory, resourceLoader, managedClassNameFilter);
  }
}
