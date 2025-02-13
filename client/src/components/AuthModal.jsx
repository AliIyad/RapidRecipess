const AuthModal = ({ isOpen, toggleModal, onLoginSuccess }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess(); // Call the callback after successful login/registration
    }
    toggleModal(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {isAuthenticated ? "Welcome!" : isLogin ? "Login" : "Register"}
      </ModalHeader>
      <ModalBody>
        {isAuthenticated ? (
          <div>
            <h4>Welcome, {user ? user.username : "User"}!</h4>
            <Button color='danger' onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <>
            {isLogin ? (
              <LoginForm onSuccess={handleLoginSuccess} />
            ) : (
              <RegisterForm onSuccess={handleLoginSuccess} />
            )}
            <Button color='link' onClick={() => setIsLogin(!isLogin)}>
              Switch to {isLogin ? "Register" : "Login"}
            </Button>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color='secondary' onClick={toggleModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AuthModal;
