<#macro style>
  /* the footer is a running element, which is used in the @bottom-center margin box */
  /* see https://pagedjs.org/documentation/7-generated-content-in-margin-boxes/ */
  footer {
    position: running(--var-footerRunning);
    font-size: 7pt;
    font-weight: 400;
    line-height: 1.5em;
  }
</#macro>

<#macro content department>
  <footer>
    <div>
      ${department.name} • ${department.street} ${department.zipCode} ${department.city}
    </div>
    <div>
      Website: ${department.url} • E-Mail: ${department.email}
    </div>
  </footer>
</#macro>
