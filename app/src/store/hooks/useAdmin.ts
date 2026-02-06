import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { adminStore } from "../zustand/adminStore";

const useAdmin = () => {
  const { adminDashboardData, isLoading, error } = useStoreWithEqualityFn(
    adminStore,
    (state) => ({
      adminDashboardData: state.adminDashboardData,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow
  );

  const { getAdminStats } = useStoreWithEqualityFn(
    adminStore,
    (state) => ({
      getAdminStats: state.getAdminStats,
    }),
    shallow
  );

  return {
    adminDashboardData,
    isLoading,
    error,
    getAdminStats,
  };
};

export default useAdmin;
