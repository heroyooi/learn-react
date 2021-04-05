import React, { FC, useCallback } from 'react';
import { CreateModal, CloseModalButton } from '@components/Modal/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const Modal: FC<Props> = ({ show, children, onCloseModal }) => {
  const stopPropgation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropgation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
