import { keysSelector } from "src/store/keys";
import { useAppSelector } from "./useStore";

export const usePassword = () => {
  const { password } = useAppSelector(keysSelector);

  return password;
};
