
const handleLogin = (e) => {
    e.preventDefault();

    $("#objectMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == ''){
        handleError("Halt! Username or password is empty");
        return false;
    }

    console.log($("input[name=_csrf]").val());

    sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

    return false;
}

const handleSignup = (e) => {
    e.preventDefault();

    $("#objectMessage").animate({width:'hide'},350);

    if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2") == ''){
        handleError("Halt! All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("Halt! Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);

    return false;
}

const LoginWindow = (props) => {
    return(
        <form id="loginForm" 
        name="loginForm"
        onSubmit={handleLogin}
        action = "/login"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

const SignupWindow = (props) => {
    return(
        <form id="signupForm" 
        name="signupForm"
        onSubmit={handleSignup}
        action = "/signup"
        method="POST"
        className="mainForm"
        >
            <label htmlFor="username">Username: </label>
            <input id="user" type="text" name="username" placeholder="username"/>
            <label htmlFor="pass">Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password"/>
            <label htmlFor="pass2">Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="formSubmit" type="submit" value="Sign up"/>
        </form>
    );
};

const AboutWindow = (props) => {
    return(
        <div id="aboutPage">
        <h1>About this App</h1>

        <h3>Why does it exist?</h3>
        <p>The purpose of this app is to allow tabletop RPG GMs to store information about things such as house rules, NPCs, quests, and items.</p>

        <h3>What can you do?</h3>
        <ul>
            <li>
                Create accounts with usernames and passwords to store in a mongoDB database
            </li>
            <li>
                Log into your existing accounts using usernames/passwords stored in the database
            </li>
            <li>
                Create house rules with names, the rules' original text, and the modified versions' text, then store those in a database
            </li>
            <li>
                View house rules that have been previously created by your account
            </li>
        </ul>
        </div>

    );
};

const createLoginWindow = (csrf) => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = (csrf) => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createAboutWindow = (csrf) => {
    ReactDOM.render(
        <AboutWindow csrf={csrf}/>,
        document.querySelector("#content")
    );
};

const setup = (csrf) => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow(csrf);
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow(csrf);
        return false;
    });

    aboutButton.addEventListener("click", (e) => {
        e.preventDefault();
        createAboutWindow(csrf);
        return false;
    });

    createLoginWindow(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});