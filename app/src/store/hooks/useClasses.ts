import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { classesStore } from "../zustand/classesStore";

const useClasses = () => {
  const { classesData, isLoading, error, isUpserting, upsertError } =
    useStoreWithEqualityFn(
    classesStore,
    (state) => ({
      classesData: state.classesData,
      isLoading: state.isLoading,
      error: state.error,
      isUpserting: state.isUpserting,
      upsertError: state.upsertError,
    }),
    shallow
  );

  const { getAllClasses, upsert } = useStoreWithEqualityFn(
    classesStore,
    (state) => ({
      getAllClasses: state.getAllClasses,
      upsert: state.upsert,
    }),
    shallow
  );

  return {
    classesData,
    isLoading,
    error,
    isUpserting,
    upsertError,
    getAllClasses,
    upsert,
  };
};

export default useClasses;
