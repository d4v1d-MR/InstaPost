// app/hooks/useForm.ts
import { useState, useCallback } from 'react';

type FormErrors<T> = Partial<Record<keyof T, string>>;

type FormOptions<T> = {
  initialValues: T;
  validate?: (values: T) => FormErrors<T>;
  onSubmit?: (values: T) => void | Promise<void>;
};

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: FormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar un campo específico
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    
    // Si hay validación, validar el campo cuando cambia
    if (validate) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  }, [values, validate]);

  // Marcar un campo como tocado
  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    
    // Validar el campo cuando pierde el foco
    if (validate) {
      const newErrors = validate(values);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  }, [values, validate]);

  // Restablecer el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Enviar el formulario
  const handleSubmit = useCallback(async () => {
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      
      // Marcar todos los campos como tocados
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Record<keyof T, boolean>);
      
      setTouched(allTouched);
      
      // Si hay errores, no enviar
      if (Object.keys(newErrors).length > 0) {
        return;
      }
    }
    
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
  };
};

export default useForm;