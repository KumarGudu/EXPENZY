import { useState, useEffect } from 'react';

interface CalculatorInputResult {
    displayValue: string;
    calculatedValue: number | null;
    isExpression: boolean;
    error: string | null;
}

export function useCalculatorInput(initialValue: string = ''): {
    value: string;
    result: CalculatorInputResult;
    setValue: (value: string) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} {
    const [value, setValue] = useState(initialValue);
    const [result, setResult] = useState<CalculatorInputResult>({
        displayValue: initialValue,
        calculatedValue: null,
        isExpression: false,
        error: null,
    });

    useEffect(() => {
        if (!value || value.trim() === '') {
            setResult({
                displayValue: '',
                calculatedValue: null,
                isExpression: false,
                error: null,
            });
            return;
        }

        // Check if the value contains any mathematical operators
        const hasOperators = /[+\-*/]/.test(value);

        if (!hasOperators) {
            // Simple number
            const num = parseFloat(value);
            setResult({
                displayValue: value,
                calculatedValue: isNaN(num) ? null : num,
                isExpression: false,
                error: isNaN(num) ? 'Invalid number' : null,
            });
            return;
        }

        // Try to evaluate the expression
        try {
            // Remove any non-numeric and non-operator characters for safety
            const sanitized = value.replace(/[^0-9+\-*/.() ]/g, '');

            // Validate the expression (basic check)
            if (sanitized !== value.replace(/ /g, '')) {
                setResult({
                    displayValue: value,
                    calculatedValue: null,
                    isExpression: true,
                    error: 'Invalid characters',
                });
                return;
            }

            // Evaluate using Function constructor (safer than eval)
            // eslint-disable-next-line no-new-func
            const calculated = new Function(`return ${sanitized}`)();

            if (typeof calculated === 'number' && !isNaN(calculated) && isFinite(calculated)) {
                setResult({
                    displayValue: value,
                    calculatedValue: Math.round(calculated * 100) / 100, // Round to 2 decimals
                    isExpression: true,
                    error: null,
                });
            } else {
                setResult({
                    displayValue: value,
                    calculatedValue: null,
                    isExpression: true,
                    error: 'Invalid expression',
                });
            }
        } catch (error) {
            setResult({
                displayValue: value,
                calculatedValue: null,
                isExpression: true,
                error: 'Invalid expression',
            });
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return {
        value,
        result,
        setValue,
        handleChange,
    };
}
