"use client"
import Link from 'next/link';
import { Button } from '../../components/Button';
import { useState } from 'react';
import axios from 'axios';
import { useLoader } from '@/app/hooks/useLoader';
import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    role: Role;
}

enum Role {
    STUDENT = "STUDENT",
    ADMIN = "ADMIN",
    INSTRUCTOR = "INSTRUCTOR"
}

interface FormErrors {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
    role: string;
    general: string;
}

type BackendFieldError = {
  _errors?: string[];
};

type BackendErrors =
  | {
      _errors?: string[];
      email?: BackendFieldError;
      name?: BackendFieldError;
      password?: BackendFieldError;
      confirmPassword?: BackendFieldError;
      role?: BackendFieldError;
      [key: string]: BackendFieldError | string[] | undefined;
    }
  | string;

export default function Register() {
    const router = useRouter();
    const { loading, setLoading } = useLoader();
    const [formData, setFormData] = useState<FormData>({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: Role.STUDENT
    });
    
    const [errors, setErrors] = useState<FormErrors>({
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: '',
        general: ''
    });

    const handleInputChange = (field: keyof FormData, value: string | Role): void => {
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

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            role: '',
            general: ''
        };

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            setErrors({
                email: '',
                name: '',
                password: '',
                confirmPassword: '',
                role: '',
                general: ''
            });
            
            const registrationData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
            };

            console.log('Registration data:', registrationData);
            
            const result = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
                registrationData
            );
            
            console.log(result);
            
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: Role.STUDENT
            });
            
            router.push('/auth/login');
        } 
        catch (error: unknown) {
            if (!axios.isAxiosError(error)) {
                setErrors(prev => ({
                ...prev,
                general: 'Registration failed. Please try again.'
                }));
                return;
            }

            console.log('Full error:', error.response?.data);

            const backendErrors = error.response?.data?.error as BackendErrors | undefined;

            const transformedErrors: FormErrors = {
                email: '',
                name: '',
                password: '',
                confirmPassword: '',
                role: '',
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
                name: 'name',
                password: 'password',
                confirmPassword: 'confirmPassword',
                role: 'role'
            };

            Object.entries(backendErrors).forEach(
                ([field, fieldError]: [string, BackendFieldError | string[] | undefined]) => {
                // Global errors
                if (field === '_errors' && Array.isArray(fieldError) && fieldError.length > 0) {
                    transformedErrors.general = fieldError[0];
                    return;
                }

                if (
                    fieldError &&
                    typeof fieldError === 'object' &&
                    '_errors' in fieldError &&
                    Array.isArray(fieldError._errors) &&
                    fieldError._errors.length > 0
                ) {
                    const frontendField = fieldMapping[field];
                    if (frontendField) {
                    transformedErrors[frontendField] = fieldError._errors[0];
                    }
                }
                }
            );

            setErrors(transformedErrors);
            }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-y-4 justify-center items-center w-full min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className='text-3xl font-bold text-blue-700'>Register</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-y-4 bg-blue-700/10 w-full max-w-md rounded-lg p-6 sm:p-8 shadow-lg">
                
                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-700">Email *</label>
                    <input 
                        placeholder="Enter your email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`p-3 outline-none border rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${
                            errors.email ? 'border-red-400' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-700">Full Name *</label>
                    <input 
                        placeholder="Enter your full name" 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`p-3 outline-none border rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${
                            errors.name ? 'border-red-400' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                </div>

                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-700">Password *</label>
                    <input 
                        placeholder="Create a password (min 6 characters)" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`p-3 outline-none border rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${
                            errors.password ? 'border-red-400' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password}</span>}
                </div>

                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-700">Confirm Password *</label>
                    <input 
                        placeholder="Confirm your password" 
                        type="password" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`p-3 outline-none border rounded-md transition-colors focus:ring-2 focus:ring-blue-500 ${
                            errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                        }`}
                        required
                    />
                    {errors.confirmPassword && <span className="text-red-500 text-xs mt-1">{errors.confirmPassword}</span>}
                    {formData.password !== '' && formData.confirmPassword !== '' && formData.password === formData.confirmPassword && (
                        <span className="text-green-500 text-xs mt-1">Passwords match ✓</span>
                    )}
                </div>

                <div className="flex flex-col gap-y-1">
                    <label className="text-sm font-medium text-blue-700">User Role *</label>
                    <select
                        aria-label="Select user role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value as Role)}
                        className={`p-3 outline-none border rounded-md transition-colors focus:ring-2 focus:ring-blue-500  ${
                            errors.role ? 'border-red-400' : 'border-gray-300'
                        }`}
                        required
                    >
                        <option value={Role.STUDENT}>Student</option>
                        <option value={Role.INSTRUCTOR}>Instructor</option>
                        <option value={Role.ADMIN}>Admin</option>
                    </select>
                    {errors.role && <span className="text-red-500 text-xs mt-1">{errors.role}</span>}
                    <span className="text-xs text-gray-500 mt-1">
                        Selected: {formData.role}
                    </span>
                </div>

                {errors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <span className="text-red-600 text-sm">{errors.general}</span>
                    </div>
                )}

                <Button variant='primary' className='mt-4 w-full py-3' type="submit" loading={loading}>
                    Register
                </Button>

                <div className="text-center mt-2">
                    <span className="text-sm text-gray-600">
                        Already have an account? 
                        <Link href='/auth/login' className="ml-1 text-blue-600 hover:text-blue-800 underline font-medium">
                            Sign In
                        </Link>
                    </span>
                </div>
            </form>
        </div>
    );
}