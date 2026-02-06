import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { packagesStore } from "../zustand/packagesStore";

const usePackages = () => {
  const { packages, isLoading, error } = useStoreWithEqualityFn(
    packagesStore,
    (state) => ({
      packages: state.packages,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow
  );

  const { getPackagesByUserId } = useStoreWithEqualityFn(
    packagesStore,
    (state) => ({
      getPackagesByUserId: state.getPackagesByUserId,
    }),
    shallow
  );

  return {
    packages,
    isLoading,
    error,
    getPackagesByUserId,
  };
};

export default usePackages;
