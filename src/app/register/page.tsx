import { Suspense } from "react";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[520px] px-4 py-16 text-center text-sm text-gray-500">
          Loading…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
