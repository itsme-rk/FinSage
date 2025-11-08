import Form from "../components/Form"

function Register() {
    return <Form 
  route={`${import.meta.env.VITE_API_BASE_URL}/api/user/register/`} 
  method="register" 
/>

}

export default Register