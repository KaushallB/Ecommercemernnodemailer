import { useState } from 'react';
import { Link } from 'react-router-dom'
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useDispatch } from 'react-redux';
import { loginUser } from "@/store/auth-slice";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const initialState = {
    identifier: '',
    password: '',
}

function AuthLogin(){

    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();

     function onSubmit(event){
        event.preventDefault();
        dispatch(loginUser(formData))
            .then((data) => {
               
               if (data?.payload?.success) {
                toast.success(data?.payload?.message);
                } else if (data?.payload?.message) {
                toast.error(data.payload.message);
                } else if (data?.error?.message) {
                toast.error(data.error.message);
                } else {
                toast.error("Registration failed");
                }
            })
            .catch((err) => {
                toast.error(err?.message || " failed");
            });
    
  
    }


    return (
    <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-green-600 tracking-tight text-foreground"> Login to Eco-Cart</h1>
            <p className="text-gray-600 mt-2">Join our eco-friendly marketplace</p>
         </div>
         <CommonForm className="text-center"
            formControls={loginFormControls}
            buttonText={'Login'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
         />
        <div className='text-center'>
            <p className="mt-2">Don't have an account? 
                <Link className="font-medium ml-2 text-green-600 hover:underline underline" to="/auth/register"> Register</Link>
            </p>
        </div>
     </div>
    ); 
}

export default AuthLogin;