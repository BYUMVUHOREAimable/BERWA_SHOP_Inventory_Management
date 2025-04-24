
import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/layout/AuthLayout";

const Register = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
