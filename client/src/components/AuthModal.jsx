import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AuthForm from "./AuthForm";

const AuthModal = ({ isOpen, toggleModal, onLoginSuccess }) => {
  useEffect(() => {
    console.log("AuthModal Rendered - isOpen:", isOpen);
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Authentication Required</ModalHeader>
      <ModalBody>
        <AuthForm onSuccess={onLoginSuccess} />
      </ModalBody>
    </Modal>
  );
};

export default AuthModal;
