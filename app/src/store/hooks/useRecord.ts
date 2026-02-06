import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { recordStore } from "../zustand/recordStore";

const useRecord = () => {
  const { recordData, isLoading, error } = useStoreWithEqualityFn(
    recordStore,
    (state) => ({
      recordData: state.recordData,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow
  );

  const { getRecordDataByUserId } = useStoreWithEqualityFn(
    recordStore,
    (state) => ({
      getRecordDataByUserId: state.getRecordDataByUserId,
    }),
    shallow
  );

  return {
    recordData,
    isLoading,
    error,
    getRecordDataByUserId,
  };
};

export default useRecord;
