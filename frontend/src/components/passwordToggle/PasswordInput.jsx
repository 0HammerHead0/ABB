import React, { useState } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const PasswordInput = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type={showPassword ? 'text' : 'password'}
                className="font-medium w-full h-[30px] rounded border-2 p-4 border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: '30px' }}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
        </div>
    );
};

export default PasswordInput;
