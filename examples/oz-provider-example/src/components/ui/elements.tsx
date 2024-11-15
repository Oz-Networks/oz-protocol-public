import React from 'react';

const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg border bg-card p-6 shadow-sm ${className || ''}`}>
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-col space-y-1.5 pb-4">
        {children}
    </div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-semibold leading-none tracking-tight">
        {children}
    </h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`pt-0 ${className || ''}`}>
        {children}
    </div>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
        {...props}
    />
);

const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
        {...props}
    >
        {children}
    </label>
);

const Button = ({
                    children,
                    className,
                    variant = 'default',
                    ...props
                }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' }) => {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary'
    };

    return (
        <button
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variants[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};

export { Card, CardHeader, CardTitle, CardContent, Input, Label, Button };
