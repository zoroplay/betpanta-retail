import { showToast } from "../components/tools/toast";

interface ToastOptions {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
}

const useSafeToast = () => {
  const toast = (options: ToastOptions) => {
    showToast({
      type: options.type,
      title: options.title,
      message: options.description,
    });
  };

  return {
    showToast: toast,
  };
};

export default useSafeToast;