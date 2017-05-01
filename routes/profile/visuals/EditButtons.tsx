import * as React from 'react';



export default ({onClose, onEdit}: {onClose: Function, onEdit: Function}) => {
  return (
    <div className="buttons">
      <button className="btn" onClick={ e => onEdit(e) }>
        <i className="material-icons">mode_edit</i>
      </button>
      <button className="btn" onClick={ e => onClose(e) }>
        <i className="material-icons">close</i>
      </button>
    </div>
  )
}