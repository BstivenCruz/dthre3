import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { dashboardStore } from "../zustand/dashboardStore";

const useDashboard = () => {
  const { dashboardData, isLoading, error } = useStoreWithEqualityFn(
    dashboardStore,
    (state) => ({
      dashboardData: state.dashboardData,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow
  );

  const { getDashboardDataByUserId } = useStoreWithEqualityFn(
    dashboardStore,
    (state) => ({
      getDashboardDataByUserId: state.getDashboardDataByUserId,
    }),
    shallow
  );

  return {
    dashboardData,
    isLoading,
    error,
    getDashboardDataByUserId,
  };
};

export default useDashboard;
