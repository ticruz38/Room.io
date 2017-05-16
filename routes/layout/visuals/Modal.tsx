import * as React from 'react';
import * as classnames from 'classnames';

export default (props: {onClose?: Function, setModal?: Function, children?: any }) => {
    if (!props.children) return null;

    const close = (e: MouseEvent) => {
        e.preventDefault();
        const clickedElement: any = e.target;
        if (clickedElement.id === "wrapper") {
            if (props.onClose) props.onClose();
            props.setModal(false);
        }
    }

    return (
        <div
            id="wrapper"
            className="modal"
            onClick={(e: any) => close(e)}
        >
            {props.children}
        </div>
    );
}