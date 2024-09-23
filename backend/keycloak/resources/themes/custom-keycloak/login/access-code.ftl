<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "title">

        ${msg("loginTitle",(realm.displayName!''))}

    <#elseif section = "header">

        ${msg("accessCodePageTitle")}

    <#elseif section = "form">

        <div id="kc-form">
        <div id="kc-form-wrapper">
        <form id="kc-form-login" class="form" onsubmit="return true;" action="${url.loginAction}" method="post" autocomplete="off">

            <div class="${properties.kcFormGroupClass!}">
                <label for="access-code" class="${properties.kcLabelClass!}">
                    ${msg("accessCodeLabel")}
                </label>
                <input tabindex="1" id="access-code" class="${properties.kcInputClass!}" name="access_code" type="text"
                    value="${(access_code!'')}" <#if access_code?exists>readonly</#if>
                    aria-invalid="<#if messagesPerField.existsError('access_code')>true</#if>"
                />
                <#if messagesPerField.existsError('access_code')>
                    <span id="input-error" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                        ${kcSanitize(messagesPerField.getFirstError('access_code'))?no_esc}
                    </span>
                </#if>
            </div>

           <div class="${properties.kcFormGroupClass!}">
               <label for="date-of-birth" class="${properties.kcLabelClass!}">
                   ${msg("dateOfBirthLabel")}
               </label>
               <input tabindex="2" id="date-of-birth" class="${properties.kcInputClass!}" name="date_of_birth" type="date"
                   aria-invalid="<#if messagesPerField.existsError('access_code')>true</#if>"
               />
               <#if messagesPerField.existsError('access_code')>
                   <span id="input-error" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                       ${kcSanitize(messagesPerField.getFirstError('access_code'))?no_esc}
                   </span>
               </#if>
           </div>

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                <input tabindex="3" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                    name="login" id="kc-login" type="submit" value="${msg("doSubmit")}"
                />
            </div>

        </form>
        </div>
        </div>

    </#if>
</@layout.registrationLayout>
