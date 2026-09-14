import React, { useState } from 'react';

interface FormFieldProps {
  label: string;
  id?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  className?: string;
}

export const AdminInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & FormFieldProps
> = ({ label, id, error, helpText, required, className = '', ...props }) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-xs font-mono font-medium text-text-secondary">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      </div>
      <input
        id={inputId}
        className={`w-full px-3 py-2 bg-bg-surface border rounded-md text-xs font-sans text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors ${
          error
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-border-subtle focus:border-action-primary'
        }`}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-500 font-mono">{error}</p>}
      {helpText && !error && <p className="text-[11px] text-text-tertiary">{helpText}</p>}
    </div>
  );
};

export const AdminTextarea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FormFieldProps
> = ({ label, id, error, helpText, required, className = '', ...props }) => {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-xs font-mono font-medium text-text-secondary">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <textarea
        id={inputId}
        rows={props.rows || 3}
        className={`w-full px-3 py-2 bg-bg-surface border rounded-md text-xs font-sans text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors resize-y ${
          error
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-border-subtle focus:border-action-primary'
        }`}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-500 font-mono">{error}</p>}
      {helpText && !error && <p className="text-[11px] text-text-tertiary">{helpText}</p>}
    </div>
  );
};

export const AdminSelect: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> &
    FormFieldProps & {
      options: { value: string; label: string }[];
    }
> = ({ label, id, error, helpText, required, options, className = '', ...props }) => {
  const inputId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-xs font-mono font-medium text-text-secondary">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        id={inputId}
        className={`w-full px-3 py-2 bg-bg-surface border rounded-md text-xs font-sans text-text-primary focus:outline-none transition-colors ${
          error
            ? 'border-rose-500 focus:border-rose-500'
            : 'border-border-subtle focus:border-action-primary'
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-rose-500 font-mono">{error}</p>}
      {helpText && !error && <p className="text-[11px] text-text-tertiary">{helpText}</p>}
    </div>
  );
};

export const AdminTagInput: React.FC<{
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helpText?: string;
  className?: string;
}> = ({ label, tags, onChange, placeholder = 'Type and press Enter...', helpText, className = '' }) => {
  const [inputVal, setInputVal] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = inputVal.trim().toLowerCase().replace(/,/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed]);
        setInputVal('');
      }
    } else if (e.key === 'Backspace' && !inputVal && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-mono font-medium text-text-secondary">{label}</label>
      <div className="w-full min-h-[42px] px-2.5 py-1.5 bg-bg-surface border border-border-subtle rounded-md flex flex-wrap items-center gap-1.5 focus-within:border-action-primary transition-colors">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-secondary text-text-primary text-[11px] font-mono rounded border border-border-subtle"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-text-tertiary hover:text-rose-500 leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none py-1"
        />
      </div>
      {helpText && <p className="text-[11px] text-text-tertiary font-sans">{helpText}</p>}
    </div>
  );
};

export const AdminToggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}> = ({ label, description, checked, onChange, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${className}`}>
      <div>
        <span className="text-xs font-mono font-medium text-text-primary">{label}</span>
        {description && <p className="text-[11px] text-text-tertiary mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-action-primary' : 'bg-bg-secondary border-border-subtle'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
