import React, { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import AuthForm from "./AuthForm";
import { useAuth } from "../context/AuthContext";

const AuthModal = ({ isOpen, toggleModal }) => {
  const { isAuthenticated, isLoading, verifyAuthState } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      toggleModal(true); // Open modal if not authenticated
    } else {
      toggleModal(false); // Close modal if authenticated
    }
  }, [isAuthenticated, isLoading, toggleModal]);

  const handleSuccess = async () => {
    try {
      await verifyAuthState(); // Ensure authentication is verified after success
      toggleModal(false); // Close modal
    } catch (error) {
      console.error("Error verifying tokens:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={() => toggleModal(false)}>
      <ModalHeader toggle={() => toggleModal(false)}>
        Authentication Required
      </ModalHeader>
      <ModalBody>
        <AuthForm onSuccess={handleSuccess} />
      </ModalBody>
    </Modal>
  );
};

export default AuthModal;
