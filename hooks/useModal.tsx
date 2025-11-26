import { useRouter, useSearchParams } from "next/navigation";
import { showModal } from "@/redux/features/slice/modal.slice";
import { useAppDispatch } from "./useAppDispatch";
export const useModal = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const openModal = ({
    ref,
    level,
    title,
    description,
    modal_name,
    modal_function,
  }: {
    ref?: string;
    level?: number;
    title?: string;
    description?: string;
    modal_name: string;
    modal_function?: string;
    onConfirm?: () => void;
  }) => {
    if (title || description || modal_function) {
      // dispatch(
      //   showModal({
      //     title,
      //     // description,
      //     // modal_function,
      //   })
      // );
    }

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("modal", modal_name);
    if (ref) {
      params.set("ref", ref);
    }
    if (level) {
      params.set("level", level.toString());
    }
    router.replace(`?${params.toString()}`);
  };

  const closeModal = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("modal");
    params.delete("ref");
    params.delete("level");
    router.replace(`?${params.toString()}`);
    // dispatch(setRerender());
  };

  return {
    openModal,
    closeModal,
  };
};
