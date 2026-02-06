import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { authStore } from "../zustand/authStore";

const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error } =
    useStoreWithEqualityFn(
      authStore,
      (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
      }),
      shallow
    );

  const { checkAuth, login, register, logout, setUser, setToken } =
    useStoreWithEqualityFn(
      authStore,
      (state) => ({
        checkAuth: state.checkAuth,
        login: state.login,
        register: state.register,
        logout: state.logout,
        setUser: state.setUser,
        setToken: state.setToken,
      }),
      shallow
    );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    checkAuth,
    login,
    register,
    logout,
    setUser,
    setToken,
  };
};

export default useAuth;
