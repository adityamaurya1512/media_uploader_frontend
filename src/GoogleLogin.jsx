
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";
import {useNavigate} from 'react-router-dom';
    
const GoolgeLogin = () => {
	
	const navigate = useNavigate();
	const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				const result = await googleAuth(authResult.code);
				const {email, name, image} = result.data.user;
				const token = result.data.token;
				const obj = {email,name, token, image};
				localStorage.setItem('user-info',JSON.stringify(obj));
				navigate('/dashboard');
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log('Error while Google Login...', e);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});

	return (
		<div className=" bg-purple-100 min-h-screen ">
			<div className="h-[10vh] bg-purple-700 flex items-center justify-between px-4">
               <h1 className="text-3xl text-white text-bold">
                Media Uploader
			   </h1>
			   <button onClick={googleLogin} className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-800 transition flex items-center gap-2">
				Sign in with Google
			   </button>
			</div>
            <div className="flex flex-col h-screen items-center justify-center">
                 <h1 className="text-2xl">Welcome to Media Uploader</h1>
				 <p>
					Login to upload media files.
				 </p>
			</div>
		</div>
	);
};

export default GoolgeLogin;