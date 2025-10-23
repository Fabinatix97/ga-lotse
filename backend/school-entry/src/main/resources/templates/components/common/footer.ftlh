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

<#macro content office>
<#-- @ftlvariable name="office" type="de.eshg.schoolentry.api.pdf.Address" -->
  <footer>
    <div>
      ${office.name} • ${office.street} ${office.zipCode} ${office.city}
    </div>
    <div>
      Website: ${office.url} • E-Mail: ${office.email?join(", ")}
    </div>
  </footer>
</#macro>
