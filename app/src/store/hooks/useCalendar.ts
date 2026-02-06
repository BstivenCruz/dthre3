import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { calendarStore } from "../zustand/calendarStore";

const useCalendar = () => {
  const { calendarData, isLoading, error } = useStoreWithEqualityFn(
    calendarStore,
    (state) => ({
      calendarData: state.calendarData,
      isLoading: state.isLoading,
      error: state.error,
    }),
    shallow
  );

  const { getCalendarClassesByUserId } = useStoreWithEqualityFn(
    calendarStore,
    (state) => ({
      getCalendarClassesByUserId: state.getCalendarClassesByUserId,
    }),
    shallow
  );

  return {
    calendarData,
    isLoading,
    error,
    getCalendarClassesByUserId,
  };
};

export default useCalendar;
