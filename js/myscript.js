function ContactCreate(storeName, dataEntity, co_client) {
    var co_description = $("#co_description").val();
    var co_type = $("#co_type").val();

    var jsonCO = {
        "client": co_client.replace("CL-", "")
    };

    var urlCO = "/api/dataentities/" + dataEntity + "/documents/";

    $.ajax({
        headers: {
            "Accept": "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(jsonCO),
        type: 'PATCH',
        url: urlCO,
        success: function(data) {
            console.log(data);
            ResetMessages()
            $("#co_message_success").show();
            $("#cl_first_name").val("");
            $("#cl_email").val("");
            $("#cl_phone").val("");

        },
        error: function(data) {
            console.log(data);
            ResetMessages()
            $("#co_message_error").show();
        }
    });
}

function ContactCreateByEmail(storeName, dataEntity, cl_email) {
    var cl_url = "/api/dataentities/CL/search/?email=" + cl_email + "&_fields=id";

    $.ajax({
        headers: {
            "Accept": "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json"
        },
        type: 'GET',
        url: cl_url,
        success: function(data, textStatus, xhr) {
            console.log(data);
            if (xhr.status == "200" || xhr.status == "201") {
                ContactCreate(storeName, dataEntity, data[0].id);
            } else {
                ResetMessages()
                $("#co_message_error").show();
            }
        },
        error: function(data) {
            console.log(data);
            ResetMessages()
            $("#co_message_error").show();
        }
    });
}

function ClientCreate() {
    var storeName = $("#master_data_store_name").val();
    var dataEntity = $("#master_data_data_entity").val();

    var cl_first_name = $("#cl_first_name").val();
    var cl_email = $("#cl_email").val();
    var cl_phone = $("#cl_phone").val();

    var cl_json = {
        "firstName": cl_first_name,
        "email": cl_email,
        "phone": cl_phone
    };

    var cl_url = "/api/dataentities/CL/documents/";

    $.ajax({
        headers: {
            "Accept": "application/vnd.vtex.ds.v10+json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(cl_json),
        type: 'PATCH',
        url: cl_url,
        success: function(data, textStatus, xhr) {
            console.log(data);
            if (xhr.status == "200" || xhr.status == "201") {
                ContactCreate(storeName, dataEntity, data.Id);
            } else if (xhr.status == "304") {
                ContactCreateByEmail(storeName, dataEntity, cl_email);
            } else {
                ResetMessages()
                $("#co_message_error").show();
            }
        },
        error: function(data) {
            console.log(data);
            ResetMessages()
            $("#co_message_error").show();
        }
    });
}

function ResetMessages() {
    $("#co_message_loading").hide();
    $("#co_message_validate").hide();
    $("#co_message_success").hide();
    $("#co_message_error").hide();
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function FormValidate() {
    var isFormValidate = true;

    if ($("#cl_first_name").val() == "") {
        isFormValidate = false;
        $("#cl_first_name").focus();
    }

    if ((isFormValidate) && ($("#cl_email").val() == "")) {
        isFormValidate = false;
        $("#cl_email").focus();
    }
    if ((isFormValidate) && (!IsEmail($("#cl_email").val()))) {
        isFormValidate = false;
        $("#cl_email").val("");
        $("#cl_email").focus();
    }


    if (isFormValidate) {
        ResetMessages()
        $("#co_message_loading").show();
        ClientCreate();
    } else {
        ResetMessages()
        $("#co_message_validate").show();
    }

    return false;
}

function FormCreate(storeName, dataEntity, htmlElementId, messageLoading, messageValidation, messageSuccess, messageError) {
    var htmlContent = '';

    htmlContent += '<div id="co_message_loading" class="alert alert-info" style="display:none;">' + messageLoading + '</div>';
    htmlContent += '<div id="co_message_validate" class="alert alert-warning" style="display:none;">' + messageValidation + '</div>';
    htmlContent += '<div id="co_message_success" class="alert alert-success" style="display:none;">' + messageSuccess + '</div>';
    htmlContent += '<div id="co_message_error" class="alert alert-danger" style="display:none;">' + messageError + '</div>';
    htmlContent += '<form id="co_form" action="javascript:FormValidate();" method="post">';
    htmlContent += '<input type="hidden" id="master_data_store_name" name="master_data_store_name" value="' + storeName + '" />';
    htmlContent += '<input type="hidden" id="master_data_data_entity" name="master_data_data_entity" value="' + dataEntity + '" />';
    htmlContent += '<div class="form-field string required cl_first_name">';
    htmlContent += '<input id="cl_first_name" maxlength="100" placeholder="Nombre Completo" name="cl_first_name" type="text" />';
    htmlContent += '</div>';
    htmlContent += '<div class="form-field string required cl_email">';
    htmlContent += '<input id="cl_email" maxlength="100" name="cl_email" placeholder="email" type="text">';
    htmlContent += '</div>';
    htmlContent += '<div class="form-field string required cl_phone">';
    htmlContent += '<input id="cl_phone" maxlength="100" placeholder="Celular" name="cl_phone" type="text" />';
    htmlContent += '</div>';
    htmlContent += '<div class="form-field submit"><input id="commit" name="commit" type="submit" value="Registrarme"></div>';
    htmlContent += '</form>';

    $("#" + htmlElementId).html(htmlContent);
}