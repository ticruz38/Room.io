import * as React from 'react';

export default ( props: { height?: string } ) => (
    <svg style={ { height: props.height || '30px' } } viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414">
        <path d="M7.963 11.98l-4.91-2.9L7.962 16l4.914-6.92-4.914 2.9zM8.037 0l-4.91 8.148 4.91 2.903 4.91-2.902L8.038 0z" fill="#010101"/>
    </svg>
)