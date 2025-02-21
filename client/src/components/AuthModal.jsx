import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AuthForm from "./AuthForm";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, toggleModal }) => {
  const { verifyTokens } = useAuth();

  const handleSuccess = async () => {
    await verifyTokens();
    toggleModal();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Authentication Required</ModalHeader>
      <ModalBody>
        <AuthForm onSuccess={handleSuccess} />
      </ModalBody>
    </Modal>
  );
};

export default AuthModal;
