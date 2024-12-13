/*
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.base.contact.persistence;

import static de.eshg.base.util.SearchSpecificationUtil.containsNormalized;
import static de.eshg.base.util.SearchSpecificationUtil.isSimilar;
import static de.eshg.base.util.SearchSpecificationUtil.similarity;
import static de.eshg.base.util.SearchSpecificationUtil.splitToWords;

import de.eshg.base.contact.ContactMapper;
import de.eshg.base.contact.api.ContactSortKey;
import de.eshg.base.contact.persistence.entity.*;
import de.eshg.base.util.PaginationUtil;
import de.eshg.base.util.SearchSpecificationUtil;
import jakarta.persistence.criteria.*;
import jakarta.persistence.metamodel.SingularAttribute;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

public class ContactSearchSpecificationUtil {
  static Specification<Contact> orderByCategory(
      Sort.Order sortDirection, SingularAttribute<Contact, String> name) {
    return (root, query, cb) -> {
      Path<InstitutionContactCategory> categoryExpression =
          cb.treat(root, InstitutionContact.class).get(InstitutionContact_.category);
      Path<String> nameExpression = root.get(name);

      Order order;
      Order secondaryOrder;
      if (sortDirection.isDescending()) {
        order = cb.desc(categoryExpression);
        secondaryOrder = cb.desc(nameExpression);
      } else {
        order = cb.asc(categoryExpression);
        secondaryOrder = cb.asc(nameExpression);
      }
      Order nullsLast = cb.asc(categoryExpression.isNull());
      return query.orderBy(nullsLast, order, secondaryOrder).getRestriction();
    };
  }

  static Specification<Contact> orderBySimilarity(String name, String street) {

    return (root, query, cb) -> {
      Expression<Double> orderExpression = similarity(cb, name, getFullNameExpression(root, cb));
      if (street != null) {
        orderExpression =
            cb.sum(
                orderExpression,
                similarity(
                    cb,
                    street,
                    root.get(Contact_.CONTACT_ADDRESS).get(DomesticContactAddress_.STREET)));
      }

      return query.orderBy(cb.desc(orderExpression)).getRestriction();
    };
  }

  static Specification<Contact> orderByType(
      Sort.Order sortDirection, SingularAttribute<Contact, String> name) {
    return (root, query, cb) -> {
      Order order;
      Order secondaryOrder;
      Expression<Class<? extends Contact>> typeExpression = root.type();
      Path<String> nameExpression = root.get(name);

      if (sortDirection.isDescending()) {
        order = cb.desc(typeExpression);
        secondaryOrder = cb.desc(nameExpression);
      } else {
        order = cb.asc(typeExpression);
        secondaryOrder = cb.asc(nameExpression);
      }

      return query.orderBy(order, secondaryOrder).getRestriction();
    };
  }

  static Specification<Contact> isNotMergedInto() {
    return (root, query, cb) -> cb.isNull(root.get(Contact_.mergedInto));
  }

  static Specification<Contact> hasType(Class<? extends Contact> type) {
    if (type == null) {
      return (root, query, cb) -> cb.and();
    }
    return (root, query, cb) -> cb.equal(root.type(), type);
  }

  static Specification<Contact> hasCategories(Set<InstitutionContactCategory> categories) {
    if (categories == null || categories.isEmpty()) {
      return (root, query, cb) -> cb.and();
    }
    return (root, query, cb) -> {
      Path<InstitutionContactCategory> path =
          cb.treat(root, InstitutionContact.class).get(InstitutionContact_.category);
      return path.in(categories);
    };
  }

  static Specification<Contact> containsNameOrHasFuzzy(String name) {
    return (root, query, cb) -> {
      Expression<String> fullName = getFullNameExpression(root, cb);
      return containsStringFieldOrHasFuzzy(cb, name, fullName);
    };
  }

  private static Expression<String> getFullNameExpression(Root<Contact> root, CriteriaBuilder cb) {
    Path<String> namePath = root.get(Contact_.name);
    Path<String> firstNamePath = cb.treat(root, PersonContact.class).get(PersonContact_.firstName);
    Expression<String> fullName =
        SearchSpecificationUtil.concatWithSeparator(cb, firstNamePath, namePath);
    return fullName;
  }

  static Specification<Contact> containsStreetOrHasFuzzy(String street) {
    return (root, query, cb) -> {
      Path<String> field = root.get(Contact_.CONTACT_ADDRESS).get(DomesticContactAddress_.STREET);
      return containsStringFieldOrHasFuzzy(cb, street, field);
    };
  }

  private static Predicate containsStringFieldOrHasFuzzy(
      CriteriaBuilder cb, String value, Expression<String> field) {
    if (value == null || value.isEmpty()) {
      return cb.and();
    }
    return cb.or(
        containsNormalized(cb, field, splitToWords(value)),
        cb.isTrue(isSimilar(cb, cb.literal(value), field)));
  }

  static PaginationUtil.PageSpec getPageSpec() {
    return ContactMapper.mapToPageSpec(0, 5, ContactSortKey.RELEVANCE, null);
  }
}
