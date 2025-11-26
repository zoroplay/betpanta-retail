import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/redux/store";
import { UserRole } from "@/data/types/user";
import { ROLES_ENUM } from "@/data/enums/enum";

const RoleWrapper =
  (allowedRoles: ROLES_ENUM[]) => (WrappedComponent: React.ComponentType) => {
    const WithRoleWrapper = (props: any) => {
      const router = useRouter();
      const { role } = useSelector((state: RootState) => state.user);

      useEffect(() => {
        if (!role || !allowedRoles.includes(role)) {
          // Redirect unauthorized users
          router.replace("/access-denied");
        }
      }, [role, router]);

      // If the user has the required role, render the wrapped component
      if (role && allowedRoles.includes(role)) {
        return <WrappedComponent {...props} />;
      }

      // Otherwise, render nothing (or a loading spinner)
      return null;
    };

    return WithRoleWrapper;
  };

export default RoleWrapper;
