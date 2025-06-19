"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/service/auth";
import { MeResponse } from "@/types/me";

export function withRoleGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[]
) {
  return function RoleProtectedComponent(props: P) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkRole = async () => {
        try {
          const user: MeResponse = await getCurrentUser();

          if (!allowedRoles.includes(user.data.role.role_name)) {
            router.replace("/unauthorized"); // redirect jika role tidak sesuai
          } else {
            setAuthorized(true);
          }
        } catch (err) {
          console.error("Gagal mengambil data user:", err);
          router.replace("/login"); // redirect jika belum login
        }
      };

      checkRole();
    }, [router]);

    if (!authorized) return null; // atau spinner/loading state

    return <WrappedComponent {...props} />;
  };
}