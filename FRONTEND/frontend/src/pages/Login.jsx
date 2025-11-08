import Form from "../components/Form"

import {Navigate} from "react-router-dom"


function Login() {
    return <><Form route="/api/token/" method="login" />
 
    </>
    
}

export default Login