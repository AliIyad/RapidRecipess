import React from "react";
import AuthModal from "../components/AuthModal";
import Cookies from "js-cookie";

const withAuth = (WrappedComponent) => {
  const AuthenticatedComponent = () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      return (
        <>
          <AuthModal isOpen={true} toggle={() => {}} />
        </>
      );
    }

    return <WrappedComponent />;
  };

  return <AuthenticatedComponent />;
};

export default withAuth;
