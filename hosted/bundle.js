"use strict";


var handleRule = function handleRule(e) {
  e.preventDefault();
  $("#objectMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#ruleName").val() == '' || $("#ruleOriginal").val() == '' || $("#ruleNew").val() == '') {
    handleError("Halt! All fields are required.");
    return false;
  }

  sendAjax('POST', $("#ruleForm").attr("action"), $("#ruleForm").serialize(), function () {
    loadRulesFromServer();
  });
  return false;
};

var RuleForm = function RuleForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "ruleForm",
      onSubmit: handleRule,
      name: "ruleForm",
      action: "/maker",
      method: "POST",
      className: "ruleForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Name: "), /*#__PURE__*/React.createElement("input", {
      id: "ruleName",
      type: "text",
      name: "name",
      placeholder: "Rule Name"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "original"
    }, "Orignal: "), /*#__PURE__*/React.createElement("input", {
      id: "ruleOriginal",
      type: "text",
      name: "original",
      placeholder: "Original Rule"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "ruleNew"
    }, "Modified: "), /*#__PURE__*/React.createElement("input", {
      id: "ruleNew",
      type: "text",
      name: "ruleNew",
      placeholder: "Modified Rule"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "makeRuleSubmit",
      type: "submit",
      value: "Make Rule"
    }))
  );
};

var RuleList = function RuleList(props) {
  if (props.rules.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "ruleList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyRule"
      }, "No rules yet"))
    );
  }

  var ruleNodes = props.rules.map(function (rule) {
    return (/*#__PURE__*/React.createElement("div", {
        key: rule._id,
        className: "rule"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/ruleimg.jpeg",
        alt: "rule image",
        className: "ruleImage"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "ruleName"
      }, " Name: ", rule.name, " "), /*#__PURE__*/React.createElement("h3", {
        className: "ruleOld"
      }, " Orignal: ", rule.ruleOld, " "), /*#__PURE__*/React.createElement("h3", {
        className: "ruleNew"
      }, " Modified: ", rule.ruleNew, " "))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "ruleList"
    }, ruleNodes)
  );
};

var loadRulesFromServer = function loadRulesFromServer() {
  sendAjax('GET', '/getRules', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RuleList, {
      rules: data.rules
    }), document.querySelector("#rules"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RuleForm, {
    csrf: csrf
  }), document.querySelector("#makeRule"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RuleList, {
    rules: []
  }), document.querySelector("#rules"));
  loadRulesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#objectMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#objectMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
