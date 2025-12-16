"use client"
import Link from 'next/link';
import { Button } from '../../components/Button';
import { useState } from 'react';
import axios , { AxiosError } from 'axios';
import { useLoader } from '@/app/hooks/useLoader';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email: string;
    password: string;
    general: string;
}

type BackendFieldError = {
  _errors?: string[];
};

type BackendErrorResponse =
  | {
      error?: {
        _errors?: string[];
        email?: BackendFieldError;
        password?: BackendFieldError;
        general?: BackendFieldError;
        [key: string]: BackendFieldError | string[] | undefined;
      };
    }
  | { error?: string };

export default function Register(){
    const { checkAuth } = useAuth()
    const router=useRouter();
    const { loading, setLoading } = useLoader();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        email: '',
        password: '',
        general: ''
    });

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault()
        setLoading(true);
        try {
            setErrors({
                email: '',
                password: '',
                general: ''
            })
            const registrationData = {
                ...formData
            };

            const result=await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/signin`,
                registrationData
            )
            console.log(result);
            localStorage.setItem('token',result.data.token);
            localStorage.setItem('session-id',result.data.user);
            localStorage.setItem('role', result.data.role)
            setFormData({
                email: '',
                password: '',
            });
            checkAuth()
            window.dispatchEvent(new Event('authStateChanged'));
            router.push('/dashboard')
        } 
        catch (error:unknown) {
            if (!axios.isAxiosError(error)) {
                setErrors(prev => ({
                    ...prev,
                    general: 'Registration failed. Please try again.'
                }));
                return;
            }
            
            const data = error.response?.data as BackendErrorResponse | undefined;
            const backendErrors = data?.error;

            const transformedErrors: FormErrors = {
                email: '',
                password: '',
                general: ''
            };

            if (!backendErrors) {
                setErrors(prev => ({
                    ...prev,
                    general: 'Registration failed. Please try again.'
                }));
                return;
            }

            if (typeof backendErrors === 'string') {
                transformedErrors.general = backendErrors;
                setErrors(transformedErrors);
                return;
            }

            const fieldMapping: Record<string, keyof FormErrors> = {
                email: 'email',
                password: 'password',
                general: 'general'
            };

            Object.entries(backendErrors).forEach(
                ([field, value]: [string, BackendFieldError | string[] | undefined]) => {
                // Global errors
                if (field === '_errors' && Array.isArray(value) && value.length > 0) {
                    transformedErrors.general = value[0];
                    return;
                }

                // Field-specific errors
                if (
                    value &&
                    typeof value === 'object' &&
                    '_errors' in value &&
                    Array.isArray(value._errors) &&
                    value._errors.length > 0
                ) {
                    const frontendField = fieldMapping[field];
                    if (frontendField) {
                    transformedErrors[frontendField] = value._errors[0];
                    }
                }
                }
            );

            setErrors(transformedErrors);
        } 
        finally{
            setLoading(false)
        }
   };
            
    return(
        <div className="flex flex-col gap-y-4 justify-center items-center w-full min-h-screen p-4">
            <div className='text-3xl font-bold text-blue-700 '>Login</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 bg-blue-700/10 w-full max-w-md rounded-lg p-6 sm:p-8">
                
                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-800">Email *</label>
                    <input 
                        placeholder="Enter your email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`p-3 outline-none bg-blue-800/20 rounded-md transition-colors focus:bg-blue-800/30 focus:ring-2 focus:ring-blue-500/50 ${
                            errors.email ? 'border border-red-400' : ''
                        }`}
                        required
                    />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                </div>

                

                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-800">Password *</label>
                    <input 
                        placeholder="Enter your password" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`p-3 outline-none bg-blue-800/20 rounded-md transition-colors focus:bg-blue-800/30 focus:ring-2 focus:ring-blue-500/50 ${
                            errors.password ? 'border border-red-400' : ''
                        }`}
                        required
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                </div>
                
                {errors.general && <span className="text-red-500 text-xs">{errors.general}</span>}
                <Button variant='primary'  className='mt-4 w-full py-3' type="submit" loading={loading}>
                    Login
                </Button>

                <div className="text-center mt-2">
                    <span className="text-sm text-blue-700">
                        Don&apos;t have an account? 
                        <Link href={'/auth/register'}><button type="button"  className="ml-1 text-blue-600 hover:text-blue-800 underline">
                            Sign Up
                        </button></Link>
                    </span>
                </div>
            </form>
            </div>
            )}