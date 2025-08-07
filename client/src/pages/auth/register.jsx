import { useState } from 'react';
import { Link } from 'react-router-dom'
import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useDispatch } from 'react-redux';
import { registerUser } from "@/store/auth-slice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const initialState = {
    userName:'',
    email:'',
    password:'',
    phone: '',
}

function AuthRegister(){

    const [formData, setFormData] = useState(initialState);
    const dispatch=useDispatch();
    const navigate=useNavigate();
   

    function onSubmit(event){
        event.preventDefault();
        dispatch(registerUser(formData))
            .then((data) => {
                if (data?.payload?.success) {
                toast.success(data?.payload?.message);
                navigate('/auth/login');
                } else if (data?.payload?.message) {
                toast.error(data.payload.message);
                } else if (data?.error?.message) {
                toast.error(data.error.message);
                } else {
                toast.error("Registration failed");
                }
            })
            .catch((err) => {
                toast.error(err?.message || "Registration failed");
            });

    console.log(formData);
    }

    return (
    <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 tracking-tight text-foreground">🌱 Join Eco-Cart</h1>
            <p className="text-gray-600 mt-2">Start your eco-friendly shopping journey</p>
         </div>
         <CommonForm className="text-center"
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
         />
        <div className='text-center'>
            <p className="mt-2">Already have an account? 
                    <Link className="font-medium ml-2 text-green-600 hover:underline underline" to="/auth/login"> Login</Link>
            </p>
        </div>
     </div>
    ); 
}

export default AuthRegister;