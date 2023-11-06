import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1605493624455-a56d6d312f6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2848&q=80")`,
      }}
      className="h-screen flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default AuthLayout;
