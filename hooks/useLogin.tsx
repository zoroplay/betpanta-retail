import { showToast } from "@/components/tools/toast";
import { useLoginMutation } from "@/redux/services/auth.service";
import environmentConfig from "@/redux/services/configs/environment.config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useLogin = () => {
  // Hook implementation goes here
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [login, { isLoading, isSuccess, isError, data, error }] =
    useLoginMutation();

  const handleLogin = async () => {
    try {
      const newErrors: Record<string, string | null> = {};

      if (!formData.username) {
        newErrors.username = "Username is required";
      }

      // Validate password
      // const passwordError = Validators.validatePassword(formData.password);
      // if (passwordError) {
      //   newErrors.password = passwordError;
      // }

      if (!formData.password) {
        newErrors.password = "Password is required";
      }

      setErrors(newErrors);
      if (Object.values(newErrors).some((error) => error)) {
        return;
      }

      await login({
        username: formData.username,
        password: formData.password,
        clientId: environmentConfig.CLIENT_ID,
      }).unwrap();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.error?.message ||
        "Network error. Please check your connection.";
      showToast({
        type: "error",
        title: "Login Failed",
        description: errorMessage,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.success) {
        showToast({
          type: "success",
          title: "Welcome back!",
          description: `Good to see you, ${data?.data?.username}`,
        });
        // router.push(OVERVIEW.SPORTS);
      } else {
        showToast({
          type: "error",
          title: "Login Failed",
          description: data?.error,
        });
      }
    }
    if (isError) {
      showToast({
        type: "error",
        title: "Login Failed",
        description: "Invalid username or password",
      });
    }
  }, [isSuccess, isError, isLoading]);

  return { formData, errors, isLoading, handleInputChange, handleLogin };
};
