<#macro content address>
<#-- @ftlvariable name="address" type="de.eshg.schoolentry.pdf.Address" -->
  <div>${address.name}</div>
  <div>${address.street!""}</div>
  <#if address.addressAddition??>
    <div>${address.addressAddition}</div>
  </#if>
  <div>${address.zipCode} ${address.city}</div>
</#macro>
