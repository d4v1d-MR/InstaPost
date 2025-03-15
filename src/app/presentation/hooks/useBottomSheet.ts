import { useContext } from "react";
import { BottomSheetContext } from "../context/BottomSheetContext";

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  
  if (context === undefined) {
    throw new Error('useBottomSheet debe ser usado dentro de un BottomSheetProvider');
  }
  
  return context;
};