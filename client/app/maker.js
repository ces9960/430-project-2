const { result } = require("underscore");

const handleRule = (e) => {
    e.preventDefault();

    $("#objectMessage").animate({width:'hide'},350);

    if($("#ruleName").val() == '' || $("#ruleOriginal").val() == '' || $("#ruleNew").val() == ''){
        handleError("Halt! All fields are required.");
        return false;
    }

    sendAjax('POST', $("#ruleForm").attr("action"), $("#ruleForm").serialize(), function(){
        loadRulesFromServer();
    });

    return false;
};

const RuleForm = (props) => {
    return(
        <form id="ruleForm"
            onSubmit={handleRule}
            name="ruleForm"
            action="/maker"
            method="POST"
            className="ruleForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="ruleName" type="text" name="name" placeholder="Rule Name" />
            <label htmlFor="original">Orignal: </label>
            <input id="ruleOriginal" type="text" name="original" placeholder="Original Rule" />
            <label htmlFor="ruleNew">Modified: </label>
            <input id="ruleNew" type="text" name="ruleNew" placeholder="Modified Rule" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeRuleSubmit" type="submit" value="Make Rule" />
        </form>
    );
};

const RuleList = function(props){
    if(props.rules.length === 0){
        return(
            <div className="ruleList">
                <h3 className="emptyRule">No rules yet</h3>
            </div>
        );
    }

    const ruleNodes = props.rules.map(function(rule){
        return(
            <div key={rule._id} className="rule">
                <img src="/assets/img/ruleimg.jpeg" alt="rule image" className="ruleImage"/>
                <h3 className="ruleName"> Name: {rule.name} </h3>
                <h3 className="ruleOld"> Orignal: {rule.ruleOld} </h3>
                <h3 className="ruleNew"> Modified: {rule.ruleNew} </h3>
            </div>
        );
    });

    return (
        <div className="ruleList">
            {ruleNodes}
        </div>
    );
};

const loadRulesFromServer = () => {
    sendAjax('GET', '/getRules', null, (data) => {
        ReactDOM.render(
            <RuleList rules={data.rules} />, document.querySelector("#rules")
        );
    });
};

const setup = function(csrf){
    ReactDOM.render(
        <RuleForm csrf={csrf} />,document.querySelector("#makeRule")
    );
    
    ReactDOM.render(
        <RuleList rules = {[]} />, document.querySelector("#rules")
    );

    loadRulesFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});