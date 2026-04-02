import { useState } from 'react';

export const useFormValidation = (initialState = {}) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'tracking_number') {
      if (!value || value.trim() === '') {
        error = 'Tracking number is required';
      } else if (value.trim().length < 3) {
        error = 'Please enter a valid tracking number (min 3 characters)';
      }
    } else if (name === 'email') {
      if (!value || value.trim() === '') {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'phone') {
      if (!value || value.trim() === '') {
        error = 'Phone number is required';
      } else if (!/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value)) {
        error = 'Please enter a valid phone number';
      }
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (name, value) => {
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  return { 
    formData, 
    errors, 
    validateField, 
    validateForm, 
    handleChange, 
    handleBlur, 
    setFormData 
  };
};