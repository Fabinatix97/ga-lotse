/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.persistence;

import java.net.URL;
import java.util.List;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.orm.jpa.JpaBaseConfigurationAccessor;
import org.springframework.core.io.ResourceLoader;
import org.springframework.orm.jpa.persistenceunit.ManagedClassNameFilter;
import org.springframework.orm.jpa.persistenceunit.PersistenceManagedTypes;
import org.springframework.stereotype.Component;

/*
 * This class is used as a workaround for
 *      https://github.com/spring-projects/spring-framework/issues/33771
 *
 * Spring improved the behavior in 6.2.0-RC3. Thus, we can remove this class
 * once Spring 6.2.0 is released, and we pull it in via Spring Boot 3.4.0.
 *
 * Do not forget to remove JpaBaseConfigurationAccessor as well.
 */
@Component
class SortedPersistenceManagedTypes implements PersistenceManagedTypes {

  private final PersistenceManagedTypes managedTypes;

  SortedPersistenceManagedTypes(
      BeanFactory beanFactory,
      ResourceLoader resourceLoader,
      ObjectProvider<ManagedClassNameFilter> managedClassNameFilter) {
    this.managedTypes =
        JpaBaseConfigurationAccessor.persistenceManagedTypes(
            beanFactory, resourceLoader, managedClassNameFilter);
  }

  @Override
  public List<String> getManagedClassNames() {
    return managedTypes.getManagedClassNames().stream().sorted().toList();
  }

  @Override
  public List<String> getManagedPackages() {
    return managedTypes.getManagedPackages();
  }

  @Override
  public URL getPersistenceUnitRootUrl() {
    return managedTypes.getPersistenceUnitRootUrl();
  }
}
