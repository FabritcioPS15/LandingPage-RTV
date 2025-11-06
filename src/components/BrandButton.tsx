import React from 'react';
import styled from 'styled-components';

type BrandButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

const BrandButton: React.FC<BrandButtonProps> = ({ label = 'Registrar', ...rest }) => {
  return (
    <StyledWrapper>
      <button {...rest} aria-label={label}>
        <p>{label}</p>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  button {
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  button {
    --primary-color: #ffffff;
    --hovered-color: #ffd9c0; /* claro del brand */
    position: relative;
    display: inline-flex;
    font-weight: 700;
    font-size: 20px;
    gap: 0.5rem;
    align-items: center;
    background: #ec8035;
    color: var(--primary-color);
    padding: 14px 24px;
    border-radius: 8px;
    transition: filter .2s ease, transform .2s ease;
  }

  button:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  button:hover:not(:disabled) {
    filter: brightness(0.95);
    transform: translateY(-1px);
  }

  button p {
    margin: 0;
    position: relative;
    font-size: 18px;
    color: var(--primary-color);
  }

  /* underline accent */
  button::after {
    position: absolute;
    content: "";
    width: 0;
    left: 20px;
    bottom: 8px;
    background: var(--hovered-color);
    height: 2px;
    transition: 0.3s ease-out;
  }

  button:hover::after {
    width: calc(100% - 40px);
  }

  button p::before {
    position: absolute;
    content: attr(data-hover-text);
    width: 0%;
    inset: 0;
    color: var(--hovered-color);
    overflow: hidden;
    transition: 0.3s ease-out;
  }

  button:hover p::before {
    width: 100%;
  }

  button:hover svg {
    transform: translateX(4px);
    color: var(--hovered-color);
  }

  button svg {
    color: var(--primary-color);
    transition: 0.2s;
    position: relative;
    width: 20px;
    transition-delay: 0.1s;
  }
`;

export default BrandButton;
